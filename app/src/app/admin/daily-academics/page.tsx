'use client';

import React, { useState } from 'react';
import { BookOpen, Send, BookMarked, FileText, CheckCircle2, ListFilter } from 'lucide-react';

interface NoteEntry {
  id: string;
  subject: string;
  topic: string;
  summary: string;
  textbookPages: string;
  homework: string;
  date: string;
  teacher: string;
}

const INITIAL_NOTES: NoteEntry[] = [
  {
    id: '1',
    subject: 'Mathematics',
    topic: 'Quadratic Equations & Roots',
    summary: 'Derivation of quadratic formula and solving factorization problems.',
    textbookPages: 'Pages 142 - 148',
    homework: 'Exercise 4.2 Questions 1 through 8',
    date: new Date().toISOString().split('T')[0],
    teacher: 'Dr. Sarah Connor',
  },
];

export default function DailyAcademicsPage() {
  const [notes, setNotes] = useState<NoteEntry[]>(INITIAL_NOTES);
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [textbookPages, setTextbookPages] = useState('');
  const [homework, setHomework] = useState('');
  const [published, setPublished] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !summary) return;

    const newNote: NoteEntry = {
      id: Date.now().toString(),
      subject,
      topic,
      summary,
      textbookPages: textbookPages || 'N/A',
      homework: homework || 'None',
      date: new Date().toISOString().split('T')[0],
      teacher: 'Current Teacher',
    };

    setNotes([newNote, ...notes]);
    setTopic('');
    setSummary('');
    setTextbookPages('');
    setHomework('');
    setPublished(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Daily Academics & Today&apos;s Notes</h1>
              <p className="text-sm text-slate-400">Record daily lesson topics, textbook assignments, and homework logs.</p>
            </div>
          </div>

          <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-2 rounded border border-indigo-500/20">
            Target: Grade 7 - Section A
          </div>
        </div>

        {published && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">Today&apos;s note broadcasted to assigned student and parent dashboards.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Note Broadcast Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-400" /> Publish Today&apos;s Note
            </h2>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="English">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Today&apos;s Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Lesson Summary</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of concepts taught..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Textbook Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Pages 142 - 148"
                  value={textbookPages}
                  onChange={(e) => setTextbookPages(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Homework Assignment</label>
                <input
                  type="text"
                  placeholder="e.g. Exercise 4.2 Q1-8"
                  value={homework}
                  onChange={(e) => setHomework(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg shadow-lg shadow-indigo-600/30 transition text-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Broadcast Today&apos;s Note
              </button>
            </form>
          </div>

          {/* Published Notes Stream */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-400" /> Published Academic Feed
              </h2>
              <span className="text-xs text-slate-400 font-mono">Total Broadcasts: {notes.length}</span>
            </div>

            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="font-bold text-indigo-400 text-sm font-mono">{note.subject}</span>
                    <span className="text-xs text-slate-400 font-mono">{note.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{note.topic}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{note.summary}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs border-t border-slate-800/80 font-mono">
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800/60">
                      <span className="text-slate-500 block mb-1">TEXTBOOK REFERENCE</span>
                      <span className="text-slate-200">{note.textbookPages}</span>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-800/60">
                      <span className="text-slate-500 block mb-1">HOMEWORK LOG</span>
                      <span className="text-amber-400">{note.homework}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
