import React from 'react';
import { generatePanels, illustratePanel } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
// SECTION: PanelQuest page
const PanelsPage = () => {
  const { story, panels, setPanels, markModuleComplete } = useStudio();
  const [beat, setBeat] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [illustratingIndex, setIllustratingIndex] = React.useState(null);
  const [error, setError] = React.useState(null);

  const storyBeats = story?.beats || [];

  const handleGenerate = async () => {
    if (!beat.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await generatePanels({ beat });
      const withImages = (data.panels || []).map((p) => ({ ...p, illustration_b64: null }));
      setPanels(withImages);
      markModuleComplete('panels');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not storyboard that beat.');
    } finally {
      setLoading(false);
    }
  };

  const handleIllustrate = async (index) => {
    const panel = panels[index];
    setIllustratingIndex(index);
    setError(null);
    try {
      const { data } = await illustratePanel({ scene_description: panel.scene_description });
      setPanels((prev) => prev.map((p, i) => (i === index ? { ...p, illustration_b64: data.b64_png } : p)));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not illustrate that panel.');
    } finally {
      setIllustratingIndex(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">PanelQuest — Storyboard &amp; Illustrate</h2>
        <p className="text-sm text-slate-400">
          Pick a beat from StoryForge (or write one directly) and PanelQuest breaks it into sequential panels you can illustrate one by one.
        </p>
      </header>

      <section className="space-y-3">
        {storyBeats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {storyBeats.map((b, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setBeat(`${b.title}: ${b.description}`)}
                className="text-[11px] rounded-full border border-studio-border px-3 py-1 text-slate-300 hover:border-studio-primary hover:text-studio-primary transition"
              >
                {b.title}
              </button>
            ))}
          </div>
        )}
        <label htmlFor="beat" className="text-xs font-medium text-slate-300">
          Beat to storyboard
        </label>
        <textarea
          id="beat"
          value={beat}
          onChange={(e) => setBeat(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-studio-border bg-studio-card/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-studio-primary/70"
          placeholder="Pick a beat above, or describe a scene directly."
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !beat.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-studio-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          {loading ? 'Storyboarding...' : 'Generate Panels'}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </section>

      {loading && <LoadingSpinner label="Breaking the scene into panels" />}

      {panels.length > 0 && !loading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {panels.map((p, i) => (
            <div key={i} className="rounded-xl border border-studio-border bg-studio-card/60 p-3 space-y-2">
              <div className="aspect-[2/3] rounded-lg bg-studio-bg border border-studio-border flex items-center justify-center overflow-hidden">
                {p.illustration_b64 ? (
                  <img
                    src={`data:image/png;base64,${p.illustration_b64}`}
                    alt={`Panel ${p.order}`}
                    className="w-full h-full object-cover"
                  />
                ) : illustratingIndex === i ? (
                  <span className="text-[10px] text-slate-500 px-3 text-center">Illustrating...</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleIllustrate(i)}
                    className="text-[11px] text-studio-primary hover:underline px-3 text-center"
                  >
                    Illustrate Panel {p.order}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{p.scene_description}</p>
              {p.dialogue && <p className="text-xs italic text-slate-500">"{p.dialogue}"</p>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
export default PanelsPage;
