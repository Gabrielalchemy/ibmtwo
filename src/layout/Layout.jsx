import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/teachers', label: 'Teachers', icon: '👩‍🏫' },
  { to: '/classes', label: 'Classes', icon: '🏫' },
  { to: '/grades', label: 'Grades', icon: '📝' },
  { to: '/attendance', label: 'Attendance', icon: '✅' },
  { to: '/fees', label: 'Fees', icon: '💰' },
];

export default function Layout() {
  return (
    <div className="flex h-[calc(100vh-52px)]">
      <aside className="w-60 bg-school-sidebar border-r border-school-border flex flex-col">
        <div className="p-4 border-b border-school-border">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Navigation</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-school-primary text-white shadow-lg shadow-school-primary/25'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-school-border">
          <div className="text-xs text-slate-500">EduHub v1.0</div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
