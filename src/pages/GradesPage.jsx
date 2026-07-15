import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext.jsx';

const empty = { studentId: '', subject: '', assessment: '', score: 0, maxScore: 100, date: '', term: 'Spring 2026' };

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-school-sidebar border border-school-border rounded-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function Grades() {
  const { grades, students, add, update, remove } = useSchool();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');

  const getStudent = (id) => students.find((s) => s.id === id);

  const filtered = grades.filter((g) => {
    const student = getStudent(g.studentId);
    const q = search.toLowerCase();
    return (
      (student?.name || '').toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.assessment.toLowerCase().includes(q) ||
      g.term.toLowerCase().includes(q)
    );
  });

  const getGradeColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return 'text-green-400';
    if (pct >= 80) return 'text-blue-400';
    if (pct >= 70) return 'text-yellow-400';
    if (pct >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (g) => { setForm({ ...g }); setEditId(g.id); setModal(true); };
  const save = () => {
    if (!form.studentId) return;
    if (editId) update(editId, form);
    else add(form);
    setModal(false);
  };
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Grades</h1>
          <p className="text-slate-400 mt-1">{grades.length} grade records</p>
        </div>
        <button onClick={openAdd} className="bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Grade
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by student, subject, assessment, or term..."
        className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary"
      />

      <div className="bg-school-card border border-school-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-school-border">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Student</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Subject</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Assessment</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Score</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Percentage</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Term</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => {
              const student = getStudent(g.studentId);
              const pct = Math.round((g.score / g.maxScore) * 100);
              return (
                <tr key={g.id} className="border-b border-school-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{student?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-slate-300">{g.subject}</td>
                  <td className="px-4 py-3 text-slate-300">{g.assessment}</td>
                  <td className="px-4 py-3 text-slate-300">{g.score}/{g.maxScore}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${getGradeColor(g.score, g.maxScore)}`}>{pct}%</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{g.date}</td>
                  <td className="px-4 py-3 text-slate-300">{g.term}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(g)} className="text-school-primary hover:text-school-primaryLight text-xs mr-3">Edit</button>
                    <button onClick={() => remove(g.id)} className="text-school-danger hover:text-red-400 text-xs">Delete</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">No grades found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Grade' : 'Add Grade'}>
        <div className="space-y-3">
          <select value={form.studentId} onChange={(e) => set('studentId', e.target.value)} className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
            <option value="">Select Student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Subject" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <input value={form.assessment} onChange={(e) => set('assessment', e.target.value)} placeholder="Assessment" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.score} onChange={(e) => set('score', parseFloat(e.target.value) || 0)} type="number" placeholder="Score" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <input value={form.maxScore} onChange={(e) => set('maxScore', parseFloat(e.target.value) || 100)} type="number" placeholder="Max Score" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.date} onChange={(e) => set('date', e.target.value)} type="date" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary" />
            <input value={form.term} onChange={(e) => set('term', e.target.value)} placeholder="Term" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button onClick={save} className="flex-1 bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">{editId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
