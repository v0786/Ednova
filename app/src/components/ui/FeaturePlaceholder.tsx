'use client';

import React from 'react';
import { Sparkles, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';

interface FeaturePlaceholderProps {
  title: string;
  description?: string;
  category?: string;
  statusText?: string;
  icon?: React.ReactNode;
  backUrl?: string;
}

export default function FeaturePlaceholder({
  title,
  description = "We're currently upgrading EDNOVA and preparing this module for your school.",
  category = "Future EDNOVA Module",
  statusText = "COMING SOON",
  icon,
  backUrl = "/teacher",
}: FeaturePlaceholderProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center font-sans max-w-2xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 w-full relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="flex flex-col items-center space-y-3">
          <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            {icon || <Sparkles className="w-8 h-8" />}
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            {statusText} • {category}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* Informational Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1 text-left">
          <div className="flex items-center gap-2 text-indigo-300 font-bold">
            <Clock className="w-4 h-4 text-indigo-400" /> Planned SDLC Phase Activation
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            EDNOVA core architecture guarantees zero fake data. This module will become fully active when its backend SDLC phase is deployed.
          </p>
        </div>

        {/* Back Action */}
        <div className="pt-2">
          <a
            href={backUrl}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition shadow-lg touch-target"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
