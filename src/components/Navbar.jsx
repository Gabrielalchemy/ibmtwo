import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/teachers', label: 'Teachers', icon: '👩‍🏫' },
  { to: '/classes', label: 'Classes', icon: '🏫' },
  { to: '/grades', label: 'Grades', icon: '📝' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
  { to: '/fees', label: 'Fees', icon: '💰' },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="bg-school-sidebar border-b border-school-border px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="text-2xl">🎓</span>
        <span className="text-xl font-bold text-white">EduHub</span>
      </Link>
      <div className="hidden md:flex items-center gap-1">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              location.pathname === l.to
                ? 'bg-school-primary text-white'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
