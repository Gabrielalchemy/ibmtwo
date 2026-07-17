import React from 'react';
import { simulatePlaytest } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
// SECTION: QuestAI page
const PlaytestPage = () => {
  const { gdd, world_bible_summary, playtest_result, setPlaytestResult, markModuleComplete } = useStudio();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const hasGdd = Boolean(gdd);

  const handleSimulate = async () => {
    if (!hasGdd) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await simulatePlaytest({ gdd, worldBibleSummary: world_bible_summary });
      setPlaytestResult(data);
      markModuleComplete('playtest');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not simulate a playtest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">QuestAI — Playtest Simulation</h2>
        <p className="text-sm text-slate-400">
          QuestAI role-plays a first-time player reacting to your GDD, surfacing strengths, concerns, and questions worth asking real testers.
        </p>
      </header>

      {!hasGdd && (
        <p className="text-sm text-slate-500 italic">
          Run ForgeAI first — QuestAI needs a GDD to react to.
        </p>
      )}

      {hasGdd && (
        <button
          type="button"
          onClick={handleSimulate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-studio-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? 'Simulating playtester...' : playtest_result ? 'Re-run Simulation' : 'Simulate Playtest'}
        </button>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {loading && <LoadingSpinner label="Imagining a first playthrough" />}

      {playtest_result && !loading && (
        <section className="space-y-4">
          <div className="rounded-xl border border-studio-border bg-studio-card/60 p-4">
            <h3 className="text-sm font-semibold text-slate-50 mb-1.5">Overall Impression</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{playtest_result.overall_impression}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-studio-success/30 bg-emerald-500/5 p-4">
              <h3 className="text-sm font-semibold text-studio-success mb-2">Strengths</h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {(playtest_result.strengths || []).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-studio-warning/30 bg-amber-500/5 p-4">
              <h3 className="text-sm font-semibold text-studio-warning mb-2">Concerns</h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {(playtest_result.concerns || []).map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-xl border border-studio-border bg-studio-card/60 p-4">
            <h3 className="text-sm font-semibold text-slate-50 mb-2">Suggested Playtest Questions</h3>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {(playtest_result.suggested_playtest_questions || []).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};
export default PlaytestPage;
