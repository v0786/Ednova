'use client';

import React, { useState } from 'react';
import { ShieldCheck, Activity, Bot, AlertTriangle, Send, CheckCircle, RefreshCw } from 'lucide-react';
import { SharedLoadingState } from '@/components/mobile/SharedUIStates';

export default function PrincipalWorkspaceView() {
  const [activeTab, setActiveTab] = useState<'EXECUTIVE_DESK' | 'SAFETY_INCIDENTS' | 'AI_GATEWAY'>('EXECUTIVE_DESK');
  
  // AI Gateway Console State
  const [aiQuery, setAiQuery] = useState<string>('What is today\'s student attendance summary across all grades?');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiQuerying, setIsAiQuerying] = useState<boolean>(false);

  const handleQueryAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiQuerying(true);
    setTimeout(() => {
      setIsAiQuerying(false);
      setAiResponse(
        `AI Operational Insight (Inherited Scope: PRINCIPAL):\n` +
        `• Aggregate Attendance Today: 96.4% (1,205 / 1,250 students present).\n` +
        `• Class 6-B highest at 98.0%, Class 8-A at 94.2%.\n` +
        `• 0 major security breaches logged at Main Gate Kiosk.`
      );
    }, 800);
  };

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Principal Executive Desk 👋</h2>
          <p className="text-xs text-slate-400">Institutional Governance & AI Gateway</p>
        </div>
        <span className="text-xs font-mono bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded border border-indigo-500/20">
          Role: PRINCIPAL
        </span>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: 'EXECUTIVE_DESK', label: 'Executive Desk' },
          { id: 'SAFETY_INCIDENTS', label: 'Safety & Incidents' },
          { id: 'AI_GATEWAY', label: 'AI Gateway' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-mono px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white bg-slate-950/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: EXECUTIVE DESK */}
      {activeTab === 'EXECUTIVE_DESK' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30">
              <p className="text-[10px] font-mono text-slate-400">TODAY'S ATTENDANCE</p>
              <p className="text-xl font-bold text-emerald-400">96.4%</p>
              <p className="text-[10px] text-slate-500">1,205 / 1,250 Present</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400">STAFF ON DUTY</p>
              <p className="text-xl font-bold text-indigo-400">64 / 68</p>
              <p className="text-[10px] text-slate-500">4 Approved Leaves</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Executive Decision Items</h3>
            <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Annual Sports Meet Budget Approval</p>
                <p className="text-[10px] text-slate-400">Submitted by Sports Department</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                PENDING
              </span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">Academic Calendar Adjustment Q3</p>
                <p className="text-[10px] text-slate-400">Submitted by Academic Council</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
                PENDING
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFETY & INCIDENTS */}
      {activeTab === 'SAFETY_INCIDENTS' && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Active Campus Safety Incidents</h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Incident #41: Perimeter Sensor Notice
              </span>
              <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">RESOLVED</span>
            </div>
            <p className="text-xs text-slate-300">North Fence perimeter sensor triggered at 10:15 AM. Verified by security patrol as routine maintenance inspection.</p>
          </div>
        </div>
      )}

      {/* TAB 3: AI GATEWAY */}
      {activeTab === 'AI_GATEWAY' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">EDNOVA Operational AI Assistant</h3>
            </div>
            <p className="text-[11px] text-slate-400">Context-Gated RAG Query Engine bound by Principal Session RLS.</p>

            <form onSubmit={handleQueryAI} className="space-y-2 pt-1">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask EDNOVA AI about campus telemetry..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isAiQuerying}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {isAiQuerying ? <SharedLoadingState message="Querying AI Gateway..." /> : <><Send className="w-3.5 h-3.5" /> Query AI Gateway</>}
              </button>
            </form>
          </div>

          {aiResponse && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                AUTHORITATIVE AI RESPONSE
              </span>
              <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans mt-2">{aiResponse}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
