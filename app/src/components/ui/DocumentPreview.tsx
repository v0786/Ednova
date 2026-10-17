'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  X,
  Download,
  FileText,
  FileImage,
  FileCode,
  File,
  Loader2,
  AlertCircle,
  FileSpreadsheet,
  FileIcon,
} from 'lucide-react';
import { generateSignedUrl } from '@/lib/actions/fileActions';

export interface DocumentPreviewProps {
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSizeBytes?: number;
  uploaderName?: string;
  createdAt?: string;
  isOpen: boolean;
  onClose: () => void;
}

type FileType = 'pdf' | 'image' | 'text' | 'code' | 'docx' | 'spreadsheet' | 'presentation' | 'unknown';

/**
 * Determines the file type based on MIME type
 */
function getFileType(mimeType: string): FileType {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/plain') return 'text';
  if (mimeType === 'text/html' || mimeType === 'text/css' || mimeType === 'text/javascript') return 'code';
  if (mimeType === 'application/json') return 'code';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword') return 'docx';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimeType === 'application/vnd.ms-excel') return 'spreadsheet';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      mimeType === 'application/vnd.ms-powerpoint') return 'presentation';
  return 'unknown';
}

/**
 * Gets the appropriate icon based on file type
 */
function getFileIcon(type: FileType, className = 'w-6 h-6') {
  switch (type) {
    case 'pdf':
      return <FileText className={className} aria-hidden="true" />;
    case 'image':
      return <FileImage className={className} aria-hidden="true" />;
    case 'code':
    case 'text':
      return <FileCode className={className} aria-hidden="true" />;
    case 'spreadsheet':
      return <FileSpreadsheet className={className} aria-hidden="true" />;
    case 'presentation':
      return <FileIcon className={className} aria-hidden="true" />;
    default:
      return <File className={className} aria-hidden="true" />;
  }
}

/**
 * Formats file size to human readable string
 */
function formatFileSize(bytes?: number): string {
  if (bytes === undefined || bytes === null) return 'Unknown size';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formats date string
 */
function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Gets file extension from filename
 */
function getFileExtension(fileName: string): string {
  const ext = fileName.split('.').pop();
  return ext ? ext.toUpperCase() : '';
}

/**
 * Document Preview Modal Component
 * Renders a read-only preview of uploaded documents
 */
export function DocumentPreview({
  fileId,
  fileName,
  mimeType,
  fileSizeBytes,
  uploaderName,
  createdAt,
  isOpen,
  onClose,
}: DocumentPreviewProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const fileType = getFileType(mimeType);

  // Fetch signed URL when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset state synchronously using refs or direct assignment is not allowed in React 19 strict mode
      // Use scheduleMicrotask pattern instead
      queueMicrotask(() => {
        setSignedUrl(null);
        setLoading(false);
        setError(null);
      });
      return;
    }

    let cancelled = false;

    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await generateSignedUrl(fileId, undefined, 3600);

        if (!cancelled) {
          if (result.success && result.data?.signedUrl) {
            setSignedUrl(result.data.signedUrl);
          } else {
            setError(result.error || 'Failed to load document');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [isOpen, fileId]);

  // Handle keyboard escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle download button click
  const handleDownload = useCallback(async () => {
    if (!fileId) return;

    setDownloading(true);
    try {
      // Generate fresh signed URL for download
      const result = await generateSignedUrl(fileId, undefined, 300);

      if (result.success && result.data?.signedUrl) {
        // Create temporary link to trigger download
        const link = document.createElement('a');
        link.href = result.data.signedUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setError(result.error || 'Failed to generate download link');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  }, [fileId, fileName]);

  // Prevent closing when clicking inside the modal content
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  if (!isOpen) return null;

  const fileExtension = getFileExtension(fileName);
  const fileIcon = getFileIcon(fileType);
  const formattedSize = formatFileSize(fileSizeBytes);
  const formattedDate = formatDate(createdAt);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-preview-title"
      aria-describedby="document-preview-description"
      data-testid="document-preview-modal"
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-[90vw] flex flex-col overflow-hidden"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
              {fileIcon}
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id="document-preview-title"
                className="text-base sm:text-lg font-bold text-white truncate"
                title={fileName}
              >
                {fileName}
              </h2>
              <p
                id="document-preview-description"
                className="text-xs text-slate-400 hidden sm:block"
              >
                {fileExtension} • {formattedSize} • Read-only preview
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 ml-4">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={`Download ${fileName}`}
              data-testid="download-button"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close preview"
              data-testid="close-button"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body - Preview Area */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {loading && (
            <div
              className="flex flex-col items-center justify-center h-64 sm:h-96"
              data-testid="loading-state"
            >
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" aria-hidden="true" />
              <p className="text-slate-400">Loading document preview...</p>
            </div>
          )}

          {error && (
            <div
              className="flex flex-col items-center justify-center h-64 sm:h-96 p-6"
              data-testid="error-state"
            >
              <div className="p-4 rounded-full bg-red-500/10 mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" aria-hidden="true" />
              </div>
              <p className="text-red-400 font-medium text-center mb-2">Failed to load document</p>
              <p className="text-slate-500 text-sm text-center max-w-md">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {!loading && !error && signedUrl && (
            <div className="w-full h-full min-h-[300px] sm:min-h-[500px]">
              {/* PDF Preview */}
              {fileType === 'pdf' && (
                <iframe
                  src={signedUrl}
                  className="w-full h-full min-h-[300px] sm:min-h-[500px] border-0"
                  title={`Preview of ${fileName}`}
                  sandbox="allow-scripts"
                  data-testid="pdf-preview"
                />
              )}

              {/* Image Preview */}
              {fileType === 'image' && (
                <div className="flex items-center justify-center p-4 sm:p-8">
                  <Image
                    src={signedUrl}
                    alt={fileName}
                    width={800}
                    height={600}
                    className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                    data-testid="image-preview"
                    unoptimized
                  />
                </div>
              )}

              {/* Text/Code Preview */}
              {(fileType === 'text' || fileType === 'code') && (
                <div className="p-4 sm:p-6" data-testid="text-preview">
                  <pre className="bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm text-slate-300 font-mono">
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <FileCode className="w-12 h-12 mb-3 opacity-50" />
                        <p>Text content available for download</p>
                        <p className="text-xs mt-1">Files are displayed in read-only mode</p>
                      </div>
                    </code>
                  </pre>
                </div>
              )}

              {/* DOCX Preview */}
              {fileType === 'docx' && (
                <div
                  className="flex flex-col items-center justify-center h-64 sm:h-96 p-6"
                  data-testid="docx-preview"
                >
                  <div className="p-4 rounded-full bg-blue-500/10 mb-4">
                    <FileText className="w-12 h-12 text-blue-500" aria-hidden="true" />
                  </div>
                  <p className="text-slate-300 font-medium text-center mb-2">Word Document</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                    DOCX files cannot be previewed directly. Please download to view the document.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="w-4 h-4" aria-hidden="true" />
                    )}
                    Download Document
                  </button>
                </div>
              )}

              {/* Spreadsheet Preview */}
              {fileType === 'spreadsheet' && (
                <div
                  className="flex flex-col items-center justify-center h-64 sm:h-96 p-6"
                  data-testid="spreadsheet-preview"
                >
                  <div className="p-4 rounded-full bg-green-500/10 mb-4">
                    <FileSpreadsheet className="w-12 h-12 text-green-500" aria-hidden="true" />
                  </div>
                  <p className="text-slate-300 font-medium text-center mb-2">Spreadsheet</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                    Spreadsheet files cannot be previewed directly. Please download to view.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 disabled:opacity-50 transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="w-4 h-4" aria-hidden="true" />
                    )}
                    Download Spreadsheet
                  </button>
                </div>
              )}

              {/* Presentation Preview */}
              {fileType === 'presentation' && (
                <div
                  className="flex flex-col items-center justify-center h-64 sm:h-96 p-6"
                  data-testid="presentation-preview"
                >
                  <div className="p-4 rounded-full bg-orange-500/10 mb-4">
                    <FileIcon className="w-12 h-12 text-orange-500" aria-hidden="true" />
                  </div>
                  <p className="text-slate-300 font-medium text-center mb-2">Presentation</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                    Presentation files cannot be previewed directly. Please download to view.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-500 disabled:opacity-50 transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="w-4 h-4" aria-hidden="true" />
                    )}
                    Download Presentation
                  </button>
                </div>
              )}

              {/* Unknown/Unsupported File Type */}
              {fileType === 'unknown' && (
                <div
                  className="flex flex-col items-center justify-center h-64 sm:h-96 p-6"
                  data-testid="unknown-preview"
                >
                  <div className="p-4 rounded-full bg-slate-700/20 mb-4">
                    <File className="w-12 h-12 text-slate-400" aria-hidden="true" />
                  </div>
                  <p className="text-slate-300 font-medium text-center mb-2">File Preview Unavailable</p>
                  <p className="text-slate-500 text-sm text-center max-w-md mb-4">
                    This file type ({mimeType}) cannot be previewed directly.
                  </p>
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 disabled:opacity-50 transition-colors"
                  >
                    {downloading ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="w-4 h-4" aria-hidden="true" />
                    )}
                    Download File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Metadata */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="sm:hidden">{fileExtension} • {formattedSize}</span>
              {uploaderName && (
                <span data-testid="uploader-info">
                  Uploaded by: <span className="text-slate-300">{uploaderName}</span>
                </span>
              )}
              <span data-testid="date-info">
                Date: <span className="text-slate-300">{formattedDate}</span>
              </span>
            </div>
            <div className="text-slate-500">
              Read-only • Secure preview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentPreview;
