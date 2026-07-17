import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`px-4 py-2 rounded transition ${
        isActive(path)
          ? 'bg-studio-primary text-white font-semibold'
          : 'text-slate-300 hover:text-white hover:bg-slate-800'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-studio-card border-b border-studio-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-studio-primary hover:text-indigo-400 transition">
          🎬 StudioAI
        </Link>

        <div className="flex gap-6">
          {navLink('/', 'Home')}
          {navLink('/studio', 'Studio')}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-slate-300 hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
