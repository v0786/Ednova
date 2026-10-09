'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, ShieldCheck, Database, AlertCircle } from 'lucide-react';
import { queryPermissionAwareAIGateway } from '@/lib/actions/aiGatewayActions';

interface AIResult {
  summary: string;
  retrievedIncidents: Array<{ id: string; title: string; category: string; severity: string; status: string }>;
  retrievedFeedback: Array<{ id: string; category: string; subject: string; status: string }>;
}

export default function AIGatewayPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await queryPermissionAwareAIGateway({ userQuery: query });
      setResult(response.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'The AI gateway request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Operational Intelligence Gateway</h1>
              <p className="text-sm text-slate-400">Tenant-scoped context retrieval and AI-generated operational summaries.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" /> Tenant Context Active
          </div>
        </div>

        {/* Query Input Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Operational Inquiry Assistant
          </h2>

          <form onSubmit={handleQuerySubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                placeholder="Ask e.g. 'Show unresolved safety concerns and facility feedback from this week...'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>Question treated as untrusted input</span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm disabled:opacity-50"
              >
                {loading ? 'Executing RAG Query...' : 'Run Intelligence Search'}
              </button>
            </div>
          </form>
          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm text-rose-400">
              <AlertCircle className="w-4 h-4" /> {error}
            </p>
          )}
        </div>

        {/* AI Insight Results & Evidence Lineage */}
        {result && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-indigo-200 text-sm leading-relaxed space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-indigo-400 font-bold border-b border-indigo-500/20 pb-2">
                <span>AI ASSISTANT GENERATED SUMMARY</span>
                <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300">CONTEXT INCLUDED</span>
              </div>
              <p>{result.summary}</p>
            </div>

            {/* Traceability Lineage */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" /> Tenant-scoped source records
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-rose-400 font-bold block">RETRIEVED INCIDENTS</span>
                  {result.retrievedIncidents.map((inc) => (
                    <div key={inc.id} className="p-2 bg-slate-900 rounded border border-slate-800/80 flex justify-between">
                      <span className="text-slate-200">{inc.title}</span>
                      <span className="text-rose-400 font-bold">{inc.severity}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-indigo-400 font-bold block">RETRIEVED FEEDBACK</span>
                  {result.retrievedFeedback.map((fb) => (
                    <div key={fb.id} className="p-2 bg-slate-900 rounded border border-slate-800/80 flex justify-between">
                      <span className="text-slate-200">{fb.subject}</span>
                      <span className="text-amber-400 font-bold">{fb.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
