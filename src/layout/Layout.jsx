import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useStudio } from '../context/StudioContext.jsx';
import ExportButton from '../components/ExportButton.jsx';
import WorldBiblePanel from '../components/WorldBiblePanel.jsx';
const modules = [
  { key: 'forge', path: '/studio/forge', label: 'ForgeAI', emoji: '🛠️' },
  { key: 'characters', path: '/studio/characters', label: 'CharacterForge', emoji: '🧙' },
  { key: 'story', path: '/studio/story', label: 'StoryForge', emoji: '📜' },
  { key: 'panels', path: '/studio/panels', label: 'PanelQuest', emoji: '🎨' },
  { key: 'playtest', path: '/studio/playtest', label: 'QuestAI', emoji: '🎮' },
  { key: 'companion', path: '/studio/companion', label: 'SidekickAI', emoji: '🤖' },
];
const Layout = () => {
  const { project_name, completed_modules } = useStudio();
  const location = useLocation();
  const forgeCompleted = completed_modules.includes('forge');
  return (
    <div className="flex h-full bg-studio-bg text-slate-100">
      <aside className="w-72 border-r border-studio-border bg-[#05050a] flex flex-col">
        <div className="px-5 pt-5 pb-4 border-b border-studio-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">🎛️</div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Studio</p>
              <p className="font-semibold">StudioAI</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-2 px-2">Modules</p>
            <ul className="space-y-1">
              {modules.map((m) => {
                const isLocked = m.key !== 'forge' && !forgeCompleted;
                const isDone = completed_modules.includes(m.key);
                return (
                  <li key={m.key}>
                    <NavLink
                      to={isLocked ? '/studio/forge' : m.path}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-lg px-3 py-2 text-sm transition
                        ${isActive ? 'bg-studio-card text-white' : 'text-slate-300 hover:bg-studio-card/60 hover:text-white'}
                        ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{m.emoji}</span>
                        <span>{m.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isDone && <span className="h-2.5 w-2.5 rounded-full bg-studio-success" aria-hidden="true"></span>}
                        {isLocked && !isDone && (
                          <span className="text-xs text-slate-400" aria-label="Locked">🔒</span>
                        )}
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <WorldBiblePanel />
        </nav>
        <div className="px-4 py-4 border-t border-studio-border text-xs text-slate-500">
          <p>AI Narrative Designer • v0.1</p>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-studio-border flex items-center justify-between px-6 bg-studio-bg/80 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Current Project</p>
            <p className="font-semibold text-sm text-slate-50 truncate max-w-xs">{project_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">{location.pathname}</span>
            <ExportButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-[#050510] via-studio-bg to-[#050510]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;