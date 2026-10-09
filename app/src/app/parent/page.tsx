'use client';

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Users, Bell, MessageSquare, Award, Calendar, CheckCircle2, ShieldCheck, Megaphone, Send } from 'lucide-react';
import { 
  getLinkedChildren, 
  getParentChildOverview, 
  getAnnouncements, 
  getNotifications, 
  getDirectMessages, 
  sendMessage, 
  LinkedStudent, 
  Announcement, 
  InAppNotification, 
  DirectMessage 
} from '@/lib/actions/communicationActions';
import { getStudentAttendanceHistory } from '@/lib/actions/attendanceActions';

export default function ParentDashboardPage() {
  const [children, setChildren] = useState<LinkedStudent[]>([]);
  const [selectedChild, setSelectedChild] = useState<LinkedStudent | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParentWorkspace();
  }, []);

  async function loadParentWorkspace() {
    setLoading(true);
    try {
      const resChildren = await getLinkedChildren('SCH-DEMO-001');
      if (resChildren.success && resChildren.data && resChildren.data.length > 0) {
        setChildren(resChildren.data);
        const child = resChildren.data[0];
        setSelectedChild(child);

        const resOverview = await getParentChildOverview('SCH-DEMO-001', child.studentId);
        if (resOverview.success) setOverview(resOverview.data);

        const attendanceRes = await getStudentAttendanceHistory('SCH-DEMO-001', child.studentId);
        if (attendanceRes.success) {
          setOverview((current: any) => ({ ...current, attendanceSummary: attendanceRes.summary }));
        }
      }

      const resAnn = await getAnnouncements('SCH-DEMO-001');
      if (resAnn.success && resAnn.data) setAnnouncements(resAnn.data);

      const resNtf = await getNotifications('SCH-DEMO-001');
      if (resNtf.success && resNtf.data) {
        setNotifications(resNtf.data);
        setUnreadCount(resNtf.unreadCount || 0);
      }

      const resMsg = await getDirectMessages('SCH-DEMO-001', 'conv-p-t-01');
      if (resMsg.success && resMsg.data) setMessages(resMsg.data);
    } catch (err) {
      console.error('Failed to load parent workspace:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    try {
      const res = await sendMessage({
        schoolId: 'SCH-DEMO-001',
        conversationId: 'conv-p-t-01',
        message: newMessageText,
      });

      if (res.success && res.data) {
        setMessages((prev) => [...prev, res.data!]);
        setNewMessageText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  }

  return (
    <AppShell userRole="PARENT" userName="Mr. Alex Morgan Sr.">
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Parent & Guardian Communication Hub</h1>
              <p className="text-xs text-slate-400 font-mono">Linked Student Academic Overview & School Notices</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {children.length > 1 && (
              <select
                value={selectedChild?.studentId}
                onChange={(e) => {
                  const child = children.find((c) => c.studentId === e.target.value);
                  if (child) setSelectedChild(child);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono p-2 text-white outline-none"
              >
                {children.map((c) => (
                  <option key={c.studentId} value={c.studentId}>{c.studentName} ({c.gradeName})</option>
                ))}
              </select>
            )}
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Authorized Guardian Session
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading parent dashboard...</div>
        ) : (
          <div className="space-y-6">
            {/* Child Overview Cards */}
            {overview && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Linked Student</span>
                  <div className="text-lg font-bold text-white truncate">{overview.studentName}</div>
                  <span className="text-[11px] text-indigo-300">{overview.gradeDivision}</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Attendance Rate</span>
                  <div className="text-2xl font-bold text-emerald-400">{overview.attendancePercentage}%</div>
                  <span className="text-[11px] text-emerald-300">Verified Presence</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Latest Exam Result</span>
                  <div className="text-lg font-bold text-indigo-400">{overview.latestResult.score}</div>
                  <span className="text-[11px] text-emerald-400 font-bold">{overview.latestResult.title} ({overview.latestResult.status})</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Unread Alerts</span>
                  <div className="text-2xl font-bold text-amber-400">{unreadCount} Notifications</div>
                  <span className="text-[11px] text-slate-400">In-App Alert System</span>
                </div>

                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
                  <span className="text-xs text-slate-400">Attendance Summary</span>
                  <div className="text-2xl font-bold text-emerald-400">{overview?.attendanceSummary?.attendancePercentage ?? 0}%</div>
                  <span className="text-[11px] text-emerald-300">{overview?.attendanceSummary?.present ?? 0} present / {overview?.attendanceSummary?.absent ?? 0} absent</span>
                </div>
              </div>
            )}

            {/* Announcements & Teacher Communication Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School Announcements */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-indigo-400" /> Official School Announcements
                </h2>
                <div className="space-y-3 font-mono text-xs">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center text-white font-bold font-sans text-sm">
                        <span>{ann.title}</span>
                        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {ann.audienceType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans">{ann.body}</p>
                      <div className="text-[11px] text-slate-500 pt-1 flex justify-between">
                        <span>Published by {ann.createdBy}</span>
                        <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Teacher ↔ Parent Communication */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2 pb-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Direct Teacher Messaging (Prof. Sarah Jenkins)
                  </h2>
                  <div className="space-y-3 font-mono text-xs max-h-[260px] overflow-y-auto pr-1">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`p-3 rounded-xl border ${
                        msg.senderId === 'usr-teacher-a'
                          ? 'bg-slate-950 border-slate-800 text-slate-200'
                          : 'bg-indigo-600/20 border-indigo-500/40 text-white ml-6'
                      }`}>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span className={msg.senderId === 'usr-teacher-a' ? 'text-indigo-400' : 'text-emerald-400'}>
                            {msg.senderName}
                          </span>
                          <span className="text-slate-500 font-normal">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="font-sans text-xs">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Type message to teacher..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold transition flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
