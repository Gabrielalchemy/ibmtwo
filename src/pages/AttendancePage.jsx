import React, { useState } from 'react';
import { useSchool } from '../context/SchoolContext.jsx';

export default function Attendance() {
  const { attendance, students, classes, add, update, remove } = useSchool();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [search, setSearch] = useState('');

  const filteredStudents = students.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });

  const getAttendanceForDate = (studentId) =>
    attendance.find((a) => a.studentId === studentId && a.date === date && (!selectedClass || a.classId === selectedClass));

  const toggleAttendance = (studentId) => {
    const existing = attendance.find((a) => a.studentId === studentId && a.date === date && (!selectedClass || a.classId === selectedClass));
    if (existing) {
      const nextStatus = existing.status === 'present' ? 'absent' : existing.status === 'absent' ? 'late' : 'present';
      update(existing.id, { status: nextStatus });
    } else {
      add({ studentId, date, status: 'present', classId: selectedClass });
    }
  };

  const markAll = (status) => {
    filteredStudents.forEach((s) => {
      const existing = attendance.find((a) => a.studentId === s.id && a.date === date && (!selectedClass || a.classId === selectedClass));
      if (existing) update(existing.id, { status });
      else add({ studentId: s.id, date, status, classId: selectedClass });
    });
  };

  const stats = filteredStudents.reduce(
    (acc, s) => {
      const a = getAttendanceForDate(s.id);
      if (a) {
        if (a.status === 'present') acc.present++;
        else if (a.status === 'absent') acc.absent++;
        else if (a.status === 'late') acc.late++;
        else acc.unmarked++;
      } else acc.unmarked++;
      return acc;
    },
    { present: 0, absent: 0, late: 0, unmarked: 0 }
  );

  const statusColors = {
    present: 'bg-green-500/20 text-green-400',
    absent: 'bg-red-500/20 text-red-400',
    late: 'bg-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
        <p className="text-slate-400 mt-1">Track daily student attendance</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary"
        />
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-school-primary"
        >
          <option value="">All Classes</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="flex-1 min-w-[200px] bg-white/5 border border-school-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-school-primary"
        />
        <div className="flex gap-2">
          <button onClick={() => markAll('present')} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">Mark All Present</button>
          <button onClick={() => markAll('absent')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors">Mark All Absent</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{stats.present}</p>
          <p className="text-xs text-green-300">Present</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
          <p className="text-xs text-red-300">Absent</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.late}</p>
          <p className="text-xs text-yellow-300">Late</p>
        </div>
        <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-slate-400">{stats.unmarked}</p>
          <p className="text-xs text-slate-300">Unmarked</p>
        </div>
      </div>

      <div className="bg-school-card border border-school-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-school-border">
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Student</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Grade</th>
              <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
              <th className="text-center px-4 py-3 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const att = getAttendanceForDate(s.id);
              const status = att?.status || 'unmarked';
              return (
                <tr key={s.id} className="border-b border-school-border/50 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-slate-300">{s.grade}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-slate-500/20 text-slate-400'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => { const ex = attendance.find((a) => a.studentId === s.id && a.date === date && (!selectedClass || a.classId === selectedClass)); if (ex) update(ex.id, { status: 'present' }); else add({ studentId: s.id, date, status: 'present', classId: selectedClass }); }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${status === 'present' ? 'bg-green-600 text-white' : 'bg-white/5 text-green-400 hover:bg-green-600/20'}`}>Present</button>
                      <button onClick={() => { const ex = attendance.find((a) => a.studentId === s.id && a.date === date && (!selectedClass || a.classId === selectedClass)); if (ex) update(ex.id, { status: 'absent' }); else add({ studentId: s.id, date, status: 'absent', classId: selectedClass }); }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${status === 'absent' ? 'bg-red-600 text-white' : 'bg-white/5 text-red-400 hover:bg-red-600/20'}`}>Absent</button>
                      <button onClick={() => { const ex = attendance.find((a) => a.studentId === s.id && a.date === date && (!selectedClass || a.classId === selectedClass)); if (ex) update(ex.id, { status: 'late' }); else add({ studentId: s.id, date, status: 'late', classId: selectedClass }); }}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${status === 'late' ? 'bg-yellow-600 text-white' : 'bg-white/5 text-yellow-400 hover:bg-yellow-600/20'}`}>Late</button>
                      {att && (
                        <button onClick={() => remove(att.id)} className="px-3 py-1 rounded text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 transition-colors">Clear</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
