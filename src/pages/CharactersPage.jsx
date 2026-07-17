import React from 'react';
import { generateCharacter, generateCharacterPortrait, generateCharacterModel3D } from '../api.js';
import { useStudio } from '../context/StudioContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
// SECTION: CharacterForge page
const CharactersPage = () => {
  const { world_bible_summary, characters, setCharacters, markModuleComplete } = useStudio();
  const [briefing, setBriefing] = React.useState('A grizzled station engineer who secretly writes poetry.');
  const [loadingProfile, setLoadingProfile] = React.useState(false);
  const [portraitLoadingFor, setPortraitLoadingFor] = React.useState(null);
  const [error, setError] = React.useState(null);

  const handleGenerate = async () => {
    if (!briefing.trim()) return;
    setLoadingProfile(true);
    setError(null);
    try {
      const { data } = await generateCharacter({ worldBibleSummary: world_bible_summary, briefing });
      setCharacters((prev) => [...prev, { ...data, portrait_b64: null }]);
      markModuleComplete('characters');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not generate that character.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePortrait = async (index) => {
    const character = characters[index];
    setPortraitLoadingFor(index);
    setError(null);
    try {
      const { data } = await generateCharacterPortrait({ name: character.name, appearance: character.appearance });
      setCharacters((prev) => prev.map((c, i) => (i === index ? { ...c, portrait_b64: data.b64_png } : c)));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Could not generate a portrait.');
    } finally {
      setPortraitLoadingFor(null);
    }
  };

  const patchCharacter = (index, patch) => {
    setCharacters((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const handleGenerate3DModel = async (index) => {
    const character = characters[index];
    if (!character.portrait_b64) return;
    setError(null);
    patchCharacter(index, { model3d_status: 'IN_PROGRESS' });
    try {
      const { data } = await generateCharacterModel3D({ portrait_b64: character.portrait_b64 });
      patchCharacter(index, { model3d_status: 'SUCCEEDED', model3d_url: data.model_url });
    } catch (err) {
      patchCharacter(index, { model3d_status: 'FAILED' });
      setError(err.response?.data?.error || err.message || 'Could not generate a 3D model. The free queue may be busy - try again in a bit.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">CharacterForge — Cast Builder</h2>
        <p className="text-sm text-slate-400">
          Describe a character in a sentence or two. CharacterForge fleshes them into a full profile, then can paint a portrait to match.
        </p>
      </header>
      <section className="space-y-3">
        <label htmlFor="briefing" className="text-xs font-medium text-slate-300">
          Character briefing
        </label>
        <textarea
          id="briefing"
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-studio-border bg-studio-card/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-studio-primary/70"
          placeholder="Who are they, roughly? A line or two is enough."
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loadingProfile || !briefing.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-studio-primary px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-wait"
        >
          {loadingProfile ? 'Fleshing out character...' : 'Generate Character'}
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </section>

      {loadingProfile && <LoadingSpinner label="Drafting a full profile" />}

      <section className="space-y-4">
        {characters.length === 0 && !loadingProfile && (
          <p className="text-sm text-slate-500 italic">No characters yet. Generate your first cast member above.</p>
        )}
        {characters.map((c, i) => (
          <div key={i} className="rounded-xl border border-studio-border bg-studio-card/60 p-4 space-y-3">
            <div className="flex gap-4">
              <div className="w-28 h-28 shrink-0 rounded-lg bg-studio-bg border border-studio-border flex items-center justify-center overflow-hidden">
                {c.portrait_b64 ? (
                  <img
                    src={`data:image/png;base64,${c.portrait_b64}`}
                    alt={`Portrait of ${c.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : portraitLoadingFor === i ? (
                  <span className="text-[10px] text-slate-500 px-2 text-center">Painting...</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePortrait(i)}
                    className="text-[10px] text-studio-primary hover:underline px-2 text-center"
                  >
                    Generate Portrait
                  </button>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-50">{c.name}</h3>
                  <span className="text-[11px] text-studio-primary uppercase tracking-[0.14em]">{c.role}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{c.appearance}</p>
                <p className="text-xs text-slate-300 leading-relaxed">{c.personality}</p>
                <p className="text-xs text-slate-500 leading-relaxed italic">{c.backstory}</p>
                <p className="text-[11px] text-slate-500">Voice: {c.voice_style}</p>
              </div>
            </div>

            {c.portrait_b64 && (
              <div className="border-t border-studio-border pt-3">
                {!c.model3d_status && (
                  <button
                    type="button"
                    onClick={() => handleGenerate3DModel(i)}
                    className="text-[11px] text-studio-primary hover:underline"
                  >
                    🧊 Generate 3D Model
                  </button>
                )}
                {c.model3d_status === 'IN_PROGRESS' && (
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <div className="h-3 w-3 border-2 border-studio-border border-t-studio-primary rounded-full animate-spin" />
                    Building 3D mesh on the free queue — this can take a few minutes...
                  </div>
                )}
                {c.model3d_status === 'FAILED' && (
                  <button
                    type="button"
                    onClick={() => handleGenerate3DModel(i)}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    3D generation failed — retry
                  </button>
                )}
                {c.model3d_status === 'SUCCEEDED' && c.model3d_url && (
                  <model-viewer
                    src={c.model3d_url}
                    camera-controls="true"
                    auto-rotate="true"
                    shadow-intensity="1"
                    style={{ width: '100%', height: '320px', backgroundColor: 'transparent' }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};
export default CharactersPage;
