'use client';

import React from 'react';
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';

export function SharedLoadingState({ message = 'Loading your information...' }: { message?: string }) {
  return (
    <div className="p-8 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-2xl">
      <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
      <p className="text-xs font-mono text-slate-400">{message}</p>
    </div>
  );
}

export function SharedErrorState({ message = "We couldn't load this information.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="p-8 text-center space-y-3 bg-slate-900 border border-red-500/20 rounded-2xl">
      <AlertTriangle className="w-6 h-6 text-red-400 mx-auto" />
      <p className="text-xs font-mono text-slate-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function SharedEmptyState({ message = 'No information is available yet.' }: { message?: string }) {
  return (
    <div className="p-8 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-2xl">
      <Inbox className="w-6 h-6 text-slate-500 mx-auto" />
      <p className="text-xs font-mono text-slate-400">{message}</p>
    </div>
  );
}
