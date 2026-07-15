import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext.jsx';

const empty = { studentId: '', amount: 0, type: 'Tuition', status: 'pending', dueDate: '', paidDate: null, term: 'Spring 2026' };

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

export default function Fees() {
  const { fees, students, add, update, remove } = useSchool();
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStudent = (id) => students.find((s) => s.id === id);

  const filtered = fees.filter((f) => {
    const student = getStudent(f.studentId);
    const q = search.toLowerCase();
    const matchSearch = (student?.name || '').toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.term.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || f.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalAmount = fees.reduce((s, f) => s + f.amount, 0);
  const paidAmount = fees.filter((f) => f.status === 'paid').reduce((s, f) => s + f.amount, 0);
  const pendingAmount = fees.filter((f) => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
  const overdueAmount = fees.filter((f) => f.status === 'overdue').reduce((s, f) => s + f.amount, 0);

  const openAdd = () => { setForm(empty); setEditId(null); setModal(true); };
  const openEdit = (f) => { setForm({ ...f }); setEditId(f.id); setModal(true); };
  const save = () => {
    if (!form.studentId || form.amount <= 0) return;
    if (editId) update(editId, form);
    else add(form);
    setModal(false);
  };
  const markPaid = (id) => update(id, { status: 'paid', paidDate: new Date().toISOString().split('T')[0] });
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const statusColors = {
    paid: 'bg-green-500/20 text-green-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    overdue: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fees & Payments</h1>
          <p className="text-slate-400 mt-1">Manage school fees and track payments</p>
        </div>
        <button onClick={openAdd} className="bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + Add Fee
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-school-card border border-school-border rounded-lg p-4">
          <p className="text-sm text-slate-400">Total Fees</p>
          <p className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-sm text-green-300">Paid</p>
          <p className="text-2xl font-bold text-green-400">${paidAmount.toLocaleString()}</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-sm text-yellow-300">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">${pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-300">Overdue</p>
          <p className="text-2xl font-bold text-red-400">${overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student, type, or term..."
          className="flex-1 bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="bg-school-card border border-school-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-school-border">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Student</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Type</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Due Date</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Paid Date</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Term</th>
              <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => {
              const student = getStudent(f.studentId);
              return (
                <tr key={f.id} className="border-b border-school-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{student?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-slate-300">{f.type}</td>
                  <td className="px-4 py-3 text-white font-semibold">${f.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[f.status] || ''}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{f.dueDate}</td>
                  <td className="px-4 py-3 text-slate-300">{f.paidDate || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{f.term}</td>
                  <td className="px-4 py-3 text-right">
                    {f.status !== 'paid' && (
                      <button onClick={() => markPaid(f.id)} className="text-green-400 hover:text-green-300 text-xs mr-3">Mark Paid</button>
                    )}
                    <button onClick={() => openEdit(f)} className="text-school-primary hover:text-school-primaryLight text-xs mr-3">Edit</button>
                    <button onClick={() => remove(f.id)} className="text-school-danger hover:text-red-400 text-xs">Delete</button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan="8" className="px-4 py-8 text-center text-slate-400">No fee records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Fee' : 'Add Fee'}>
        <div className="space-y-3">
          <select value={form.studentId} onChange={(e) => set('studentId', e.target.value)} className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
            <option value="">Select Student</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.amount} onChange={(e) => set('amount', parseFloat(e.target.value) || 0)} type="number" placeholder="Amount ($)" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
              <option>Tuition</option>
              <option>Lab Fee</option>
              <option>Library Fee</option>
              <option>Activity Fee</option>
              <option>Exam Fee</option>
              <option>Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} type="date" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary" />
            <input value={form.term} onChange={(e) => set('term', e.target.value)} placeholder="Term" className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary" />
          </div>
          <select value={form.status} onChange={(e) => set('status', e.target.value)} className="w-full bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary">
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setModal(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
            <button onClick={save} className="flex-1 bg-school-primary hover:bg-school-primaryLight text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">{editId ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
