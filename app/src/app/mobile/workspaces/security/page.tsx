'use client';

import React, { useState } from 'react';
import { Shield, DoorOpen, AlertTriangle, CheckCircle, XCircle, Search, Clock } from 'lucide-react';
import { SharedLoadingState } from '@/components/mobile/SharedUIStates';

interface GateLog {
  id: string;
  personName: string;
  personIdentifier: string;
  personType: 'STUDENT' | 'STAFF' | 'VISITOR';
  eventType: 'ENTRY' | 'EXIT' | 'VISITOR_CHECKIN' | 'VISITOR_CHECKOUT';
  gateName: string;
  timestamp: string;
}

export default function SecurityWorkspaceView() {
  const [activeTab, setActiveTab] = useState<'GATE_KIOSK' | 'MOVEMENT_LOGS' | 'EMERGENCY_ALERTS'>('GATE_KIOSK');
  
  // Gate Kiosk State
  const [personType, setPersonType] = useState<'STUDENT' | 'STAFF' | 'VISITOR'>('STUDENT');
  const [identifier, setIdentifier] = useState<string>('STU-101');
  const [personName, setPersonName] = useState<string>('Aarav Morgan');
  const [gateName, setGateName] = useState<string>('MAIN_GATE');
  
  const [recentLogs, setRecentLogs] = useState<GateLog[]>([
    { id: 'g-01', personName: 'Aarav Morgan', personIdentifier: 'STU-101', personType: 'STUDENT', eventType: 'ENTRY', gateName: 'MAIN_GATE', timestamp: '08:48 AM' },
    { id: 'g-02', personName: 'Anaya Morgan', personIdentifier: 'STU-102', personType: 'STUDENT', eventType: 'ENTRY', gateName: 'JUNIOR_GATE', timestamp: '08:42 AM' },
    { id: 'g-03', personName: 'John Doe (Vendor)', personIdentifier: 'VIS-402', personType: 'VISITOR', eventType: 'VISITOR_CHECKIN', gateName: 'MAIN_GATE', timestamp: '09:15 AM' },
  ]);

  const [feedback, setFeedback] = useState<{ type: 'SUCCESS' | 'DENIED' | 'WARNING'; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleRecordMovement = (eventType: 'ENTRY' | 'EXIT' | 'VISITOR_CHECKIN' | 'VISITOR_CHECKOUT') => {
    if (!identifier.trim() || !personName.trim()) {
      setFeedback({ type: 'WARNING', message: '⚠ VERIFICATION REQUIRED: Please enter person identifier and name.' });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newLog: GateLog = {
        id: 'g-' + Date.now(),
        personName,
        personIdentifier: identifier,
        personType,
        eventType,
        gateName,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setRecentLogs([newLog, ...recentLogs]);
      setFeedback({
        type: 'SUCCESS',
        message: `✓ ${eventType} RECORDED: ${personName} (${identifier}) logged at ${gateName}.`,
      });
    }, 500);
  };

  return (
    <div className="space-y-4 font-sans text-white p-4 bg-slate-900 rounded-2xl border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-indigo-400">Security Guard Kiosk 👋</h2>
          <p className="text-xs text-slate-400">Campus Access & Gate Kiosk Management</p>
        </div>
        <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
          MAIN_GATE ACTIVE
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800/80">
        {[
          { id: 'GATE_KIOSK', label: 'Gate Kiosk' },
          { id: 'MOVEMENT_LOGS', label: 'Recent Logs' },
          { id: 'EMERGENCY_ALERTS', label: 'Safety Alerts' },
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

      {/* TAB 1: GATE KIOSK */}
      {activeTab === 'GATE_KIOSK' && (
        <div className="space-y-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Gate Movement Scanner</h3>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">PERSON TYPE</label>
                <select
                  value={personType}
                  onChange={(e) => setPersonType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-indigo-300 font-mono focus:outline-none"
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="STAFF">STAFF</option>
                  <option value="VISITOR">VISITOR</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">GATE LOCATION</label>
                <select
                  value={gateName}
                  onChange={(e) => setGateName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-indigo-300 font-mono focus:outline-none"
                >
                  <option value="MAIN_GATE">MAIN GATE</option>
                  <option value="JUNIOR_GATE">JUNIOR GATE</option>
                  <option value="NORTH_GATE">NORTH GATE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">PERSON IDENTIFIER / CARD ID</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Scan or enter ID (e.g. STU-101)..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">PERSON NAME</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Full Name..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleRecordMovement('ENTRY')}
                disabled={isProcessing}
                className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle className="w-4 h-4" /> RECORD ENTRY
              </button>
              <button
                onClick={() => handleRecordMovement('EXIT')}
                disabled={isProcessing}
                className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <DoorOpen className="w-4 h-4" /> RECORD EXIT
              </button>
            </div>
          </div>

          {/* Feedback Status */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono font-bold ${
                feedback.type === 'SUCCESS'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : feedback.type === 'DENIED'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MOVEMENT LOGS */}
      {activeTab === 'MOVEMENT_LOGS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Campus Gate Movement Timeline</h3>
          {recentLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{log.personName} ({log.personIdentifier})</p>
                <p className="text-[10px] text-slate-400">{log.personType} • {log.gateName}</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded block ${
                  log.eventType === 'ENTRY' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                }`}>
                  {log.eventType}
                </span>
                <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SAFETY ALERTS */}
      {activeTab === 'EMERGENCY_ALERTS' && (
        <div className="space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">Security Emergency Alerts</h3>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">ALL CLEAR</span>
            <p className="text-xs font-bold text-white">Campus Perimeter Status</p>
            <p className="text-[11px] text-slate-400">All gate kiosks operating normally under verified Security Staff protocol.</p>
          </div>
        </div>
      )}
    </div>
  );
}
