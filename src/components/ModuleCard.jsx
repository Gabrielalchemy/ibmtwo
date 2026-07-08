import React from 'react';
// SECTION: Module card
const ModuleCard = ({ title, emoji, status, description, onPrimary, primaryLabel = 'Open Module' }) => {
  const isDone = status === 'done';
  const isLocked = status === 'locked';
  return (
    <div className="relative rounded-2xl border border-studio-border/80 bg-studio-card/80 p-5 shadow-sm hover:border-studio-primary/80 transition group">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{emoji}</span>
            <h3 className="text-sm font-semibold text-slate-50 tracking-tight">{title}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium border
          ${isDone ? 'border-studio-success/40 text-studio-success bg-emerald-500/10' : ''}
          ${isLocked ? 'border-slate-600/60 text-slate-400 bg-slate-800/40' : ''}
          ${!isDone && !isLocked ? 'border-studio-primary/40 text-studio-primary bg-indigo-500/10' : ''}`}
        >
          {isDone && <span>Completed</span>}
          {isLocked && <span>Locked</span>}
          {!isDone && !isLocked && <span>In Progress</span>}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isLocked}
          onClick={onPrimary}
          className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition
            ${isLocked ? 'cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-studio-primary text-white hover:bg-indigo-500'}`}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
};
export default ModuleCard;