import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext.jsx';

const empty = { name: '', subject: '', teacherId: '', room: '', schedule: '', capacity: 30, enrolled: 0 };

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

export default function Classes() {
  const { classes, teachers, add, update, remove } = useSchool();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);

  const getTeacher = (id) => teachers.find((t) => t.id === id);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (c) => { setForm({ ...c }); setEditId(c.id); setModal(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editId) update(editId, form);
    else add(form);
    setModal(false);
  };
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Classes</h1>
          <p className="text-slate-400 mt-1">{classes.length} classes scheduled</p>
        </div>
        <button onClick={openAdd} className="bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {classes.map((c) => {
          const teacher = getTeacher(c.teacherId);
          const fillPct = c.capacity > 0 ? Math.round((c.enrolled / c.capacity) * 100) : 0;
          return (
            <div key={c.id} className="bg-school-card border border-school-border rounded-xl p-5 hover:border-school-primary/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                  <p className="text-sm text-slate-400">{c.subject}</p>
                </div>
                <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded">{c.room}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Teacher:</span>
                  <span className="text-white">{teacher?.name || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Schedule:</span>
                  <span className="text-white">{c.schedule}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Enrolled:</span>
                  <span className="text-white">{c.enrolled}/{c.capacity}</span>
                </div>
                <div className="mt-2">
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${fillPct >= 90 ? 'bg-school-danger' : fillPct >= 70 ? 'bg-school-warning' : 'bg-school-success'}`} style={{ width: `${fillPct}%` }} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-school-border">
                <button onClick={() => openEdit(c)} className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs py-2 rounded-lg transition-colors">Edit</button>
                <button onClick={() => remove(c.id)} className="flex-1 bg-school-danger/10 hover:bg-school-danger/20 text-school-danger text-xs py-2 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Class' : 'Add Class'}>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Class Name (e.g. Math 101)" className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Subject" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <input value={form.room} onChange={(e) => set('room', e.target.value)} placeholder="Room" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <select value={form.teacherId} onChange={(e) => set('teacherId', e.target.value)} className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
            <option value="">Assign Teacher</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name} – {t.subject}</option>)}
          </select>
          <input value={form.schedule} onChange={(e) => set('schedule', e.target.value)} placeholder="Schedule (e.g. Mon/Wed/Fri 9:00-10:00)" className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.capacity} onChange={(e) => set('capacity', parseInt(e.target.value) || 0)} type="number" placeholder="Capacity" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <input value={form.enrolled} onChange={(e) => set('enrolled', parseInt(e.target.value) || 0)} type="number" placeholder="Enrolled" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
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
