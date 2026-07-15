import React from 'react';
import { useSchool } from '../context/SchoolContext.jsx';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, color, to }) {
  return (
    <Link to={to} className={`bg-school-card border border-school-border rounded-xl p-5 hover:border-${color} transition-all group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl group-hover:scale-110 transition-transform">{icon}</span>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { students, teachers, classes, grades, attendance, fees } = useSchool();

  const activeStudents = students.filter((s) => s.status === 'active').length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const totalFees = fees.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const pendingFees = totalFees - paidFees;
  const avgGrade = grades.length ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length) : 0;
  const todayPresent = attendance.filter((a) => a.status === 'present').length;
  const todayAbsent = attendance.filter((a) => a.status === 'absent').length;
  const attendanceRate = (todayPresent + todayAbsent) > 0 ? Math.round((todayPresent / (todayPresent + todayAbsent)) * 100) : 0;

  const recentGrades = [...grades].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back. Here's your school overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎓" label="Active Students" value={activeStudents} color="school-primary" to="/students" />
        <StatCard icon="👩‍🏫" label="Teachers" value={activeTeachers} color="school-success" to="/teachers" />
        <StatCard icon="🏫" label="Classes" value={classes.length} color="school-warning" to="/classes" />
        <StatCard icon="📊" label="Avg Grade" value={`${avgGrade}%`} color="school-info" to="/grades" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="✅" label="Attendance Rate" value={`${attendanceRate}%`} color="school-success" to="/attendance" />
        <StatCard icon="💰" label="Total Fees" value={`$${totalFees.toLocaleString()}`} color="school-warning" to="/fees" />
        <StatCard icon="⏳" label="Pending Fees" value={`$${pendingFees.toLocaleString()}`} color="school-danger" to="/fees" />
        <StatCard icon="✅" label="Paid Fees" value={`$${paidFees.toLocaleString()}`} color="school-success" to="/fees" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-school-card border border-school-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Grades</h3>
          {recentGrades.length === 0 ? (
            <p className="text-slate-400 text-sm">No grades recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentGrades.map((g) => {
                const student = students.find((s) => s.id === g.studentId);
                return (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-white">{student?.name || 'Unknown Student'}</p>
                      <p className="text-xs text-slate-400">{g.assessment} – {g.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${g.score / g.maxScore >= 0.7 ? 'text-school-success' : 'text-school-danger'}`}>
                        {g.score}/{g.maxScore}
                      </p>
                      <p className="text-xs text-slate-400">{g.date}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-school-card border border-school-border rounded-xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Class Overview</h3>
          <div className="space-y-3">
            {classes.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.room} – {c.schedule}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-school-primary rounded-full" style={{ width: `${(c.enrolled / c.capacity) * 100}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{c.enrolled}/{c.capacity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
