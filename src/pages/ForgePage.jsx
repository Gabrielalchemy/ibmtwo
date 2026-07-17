import React from 'react';
import { generateForgeGDD } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
// SECTION: ForgeAI page
const ForgePage = () => {
  const {
    setProjectId,
    project_name,
    setProjectName,
    completed_modules,
    markModuleComplete,
    world_bible_summary,
    setWorldBibleSummary,
    setPillars,
    setGdd,
  } = useStudio();
  const [concept, setConcept] = React.useState('A cozy sci-fi trading sim on a ringworld station.');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const hasRunForge = completed_modules.includes('forge');

  const handleRunForge = async () => {
    if (!concept.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await generateForgeGDD({ concept });
      setProjectId((prev) => prev || `proj_${Math.random().toString(36).slice(2, 8)}`);
      setProjectName(data.project_name || 'Untitled Project');
      setWorldBibleSummary(data.world_bible_summary || '');
      setPillars(Array.isArray(data.pillars) ? data.pillars : []);
      setGdd(data.gdd || null);
      markModuleComplete('forge');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Something went wrong generating your world bible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">ForgeAI — World &amp; GDD Generator</h2>
        <p className="text-sm text-slate-400">
          Start here. Describe your game in natural language. StudioAI shapes it into a world bible, pillars, and a structured game design document that powers the rest of the studio.
        </p>
      </header>
      <section className="space-y-3">
        <label htmlFor="concept" className="text-xs font-medium text-slate-300">
          Game concept / setting
        </label>
        <textarea
          id="concept"
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-studio-border bg-studio-card/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-studio-primary/70"
          placeholder="Describe your fantasy, inspirations, and desired player fantasy..."
        />
        <button
          type="button"
          onClick={handleRunForge}
          disabled={loading || !concept.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-studio-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? 'Generating Bible & GDD...' : hasRunForge ? 'Regenerate World Bible' : 'Run ForgeAI'}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </section>
      <section className="border border-studio-border rounded-xl bg-studio-card/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-50">World Bible Snapshot</h3>
          <span className="text-[11px] text-slate-500 uppercase tracking-[0.18em]">Preview</span>
        </div>
        {loading ? (
          <LoadingSpinner label="Weaving your universe" />
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">{world_bible_summary}</p>
        )}
        {hasRunForge && project_name && !loading && (
          <p className="text-xs text-slate-500">Project name: <span className="text-slate-300">{project_name}</span></p>
        )}
      </section>
    </div>
  );
};
export default ForgePage;
