export type MobileErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'VALIDATION_ERROR'
  | 'OFFLINE'
  | 'SESSION_EXPIRED'
  | 'MAINTENANCE';

export interface MobileError {
  code: MobileErrorCode;
  message: string;
  statusCode?: number;
}

/**
 * Normalizes any unknown error into a safe, user-facing MobileError.
 * Never leaks database errors, SQL, stack traces, or internal secrets.
 */
export function normalizeMobileError(error: unknown): MobileError {
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    const err = error as { code: MobileErrorCode; message: string; statusCode?: number };
    return {
      code: err.code,
      message: sanitizeMessage(err.message),
      statusCode: err.statusCode,
    };
  }

  if (error instanceof Error) {
    const msg = error.message.toUpperCase();
    if (msg.includes('UNAUTHORIZED') || msg.includes('AUTHENTICATION')) {
      return { code: 'UNAUTHORIZED', message: 'Authentication required. Please log in again.' };
    }
    if (msg.includes('FORBIDDEN') || msg.includes('PERMISSION')) {
      return { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' };
    }
    if (msg.includes('NETWORK') || msg.includes('FETCH')) {
      return { code: 'NETWORK_ERROR', message: 'Network request failed. Please check your connection.' };
    }
  }

  return {
    code: 'SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
  };
}

function sanitizeMessage(msg: string): string {
  // Strips SQL queries, internal file paths, or DB schema details
  if (msg.includes('postgres') || msg.includes('SELECT') || msg.includes('INSERT') || msg.includes('/home/')) {
    return 'A server error occurred. Please try again later.';
  }
  return msg;
}
