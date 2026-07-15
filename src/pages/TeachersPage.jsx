import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext.jsx';

const empty = { name: '', email: '', subject: '', phone: '', department: '', status: 'active' };

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

export default function Teachers() {
  const { teachers, add, update, remove } = useSchool();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');

  const filtered = teachers.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (t) => { setForm({ ...t }); setEditId(t.id); setModal(true); };
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
          <h1 className="text-2xl font-bold text-white">Teachers</h1>
          <p className="text-slate-400 mt-1">{teachers.length} teachers on staff</p>
        </div>
        <button onClick={openAdd} className="bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Teacher
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or subject..."
        className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary"
      />

      <div className="bg-school-card border border-school-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-school-border">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Subject</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Department</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Phone</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-school-border/50 hover:bg-white/5">
                <td className="px-4 py-3 text-white font-medium">{t.name}</td>
                <td className="px-4 py-3 text-slate-300">{t.email}</td>
                <td className="px-4 py-3 text-slate-300">{t.subject}</td>
                <td className="px-4 py-3 text-slate-300">{t.department}</td>
                <td className="px-4 py-3 text-slate-300">{t.phone}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(t)} className="text-school-primary hover:text-school-primaryLight text-xs mr-3">Edit</button>
                  <button onClick={() => remove(t.id)} className="text-school-danger hover:text-red-400 text-xs">Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-8 text-center text-slate-400">No teachers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Teacher' : 'Add Teacher'}>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Full Name" className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          <input value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="Email" className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="Subject" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <input value={form.department} onChange={(e) => set('department', e.target.value)} placeholder="Department" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Phone" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
