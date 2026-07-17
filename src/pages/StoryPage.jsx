import React from 'react';
import { generateStory } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
// SECTION: StoryForge page
const StoryPage = () => {
  const { world_bible_summary, characters, story, setStory, markModuleComplete } = useStudio();
  const [direction, setDirection] = React.useState('A heist goes wrong and the crew has to trust a rival they just betrayed.');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleGenerate = async () => {
    if (!direction.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await generateStory({ worldBibleSummary: world_bible_summary, characters, direction });
      setStory(data);
      markModuleComplete('story');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not generate a story outline.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">StoryForge — Narrative Outline</h2>
        <p className="text-sm text-slate-400">
          Give StoryForge a direction and it'll structure a premise, act breakdown, and sequential beats — pulling in whatever cast you've already built.
        </p>
      </header>
      <section className="space-y-3">
        <label htmlFor="direction" className="text-xs font-medium text-slate-300">
          Story direction
        </label>
        <textarea
          id="direction"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-studio-border bg-studio-card/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-studio-primary/70"
          placeholder="What should happen? A rough beat or theme is enough."
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !direction.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-studio-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? 'Structuring story...' : story ? 'Regenerate Outline' : 'Generate Story Outline'}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </section>

      {loading && <LoadingSpinner label="Structuring the narrative" />}

      {story && !loading && (
        <section className="space-y-4">
          <div className="rounded-xl border border-studio-border bg-studio-card/60 p-4">
            <h3 className="text-sm font-semibold text-slate-50 mb-1.5">Premise</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{story.premise}</p>
          </div>
          <div className="rounded-xl border border-studio-border bg-studio-card/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-50">Act Structure</h3>
            {(story.act_structure || []).map((a, i) => (
              <div key={i}>
                <p className="text-xs font-semibold text-studio-primary uppercase tracking-[0.14em]">{a.act}</p>
                <p className="text-sm text-slate-300 leading-relaxed">{a.summary}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-studio-border bg-studio-card/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-50">Beats</h3>
            {(story.beats || []).map((b, i) => (
              <div key={i} className="border-l-2 border-studio-primary/40 pl-3">
                <p className="text-sm font-medium text-slate-100">{b.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                {Array.isArray(b.characters_involved) && b.characters_involved.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1">Involves: {b.characters_involved.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
export default StoryPage;
