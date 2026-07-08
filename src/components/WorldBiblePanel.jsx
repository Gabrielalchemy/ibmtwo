import React from 'react';
import { useStudio } from '../context/StudioContext.jsx';
// SECTION: World Bible summary
const WorldBiblePanel = () => {
  const { world_bible_summary } = useStudio();
  return (
    <div className="mt-6 rounded-xl border border-studio-border bg-studio-card/60 p-3 text-xs text-slate-300">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-100 flex items-center gap-1">
          🌌 World Bible
        </span>
        <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Lore Snapshot</span>
      </div>
      <p className="leading-relaxed line-clamp-5">{world_bible_summary}</p>
    </div>
  );
};
export default WorldBiblePanel;