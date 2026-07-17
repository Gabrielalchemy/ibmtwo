import React, { createContext, useContext, useState, useMemo } from 'react';
const StudioContext = createContext(null);
export const StudioProvider = ({ children }) => {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [completedModules, setCompletedModules] = useState([]); // e.g. ['forge', 'characters']
  const [worldBibleSummary, setWorldBibleSummary] = useState('No lore generated yet. Run ForgeAI to create your world bible.');
  const [pillars, setPillars] = useState([]);
  const [gdd, setGdd] = useState(null);
  const [characters, setCharacters] = useState([]); // [{ name, role, appearance, personality, backstory, voice_style, portrait_b64 }]
  const [story, setStory] = useState(null); // { premise, act_structure, beats }
  const [panels, setPanels] = useState([]); // [{ order, scene_description, dialogue, illustration_b64 }]
  const [playtestResult, setPlaytestResult] = useState(null);
  const [companionHistory, setCompanionHistory] = useState([]); // [{ role: 'user'|'assistant', content }]

  const markModuleComplete = (key) => {
    setCompletedModules((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const value = useMemo(
    () => ({
      project_id: projectId,
      setProjectId,
      project_name: projectName,
      setProjectName,
      completed_modules: completedModules,
      setCompletedModules,
      markModuleComplete,
      world_bible_summary: worldBibleSummary,
      setWorldBibleSummary,
      pillars,
      setPillars,
      gdd,
      setGdd,
      characters,
      setCharacters,
      story,
      setStory,
      panels,
      setPanels,
      playtest_result: playtestResult,
      setPlaytestResult,
      companion_history: companionHistory,
      setCompanionHistory,
    }),
    [projectId, projectName, completedModules, worldBibleSummary, pillars, gdd, characters, story, panels, playtestResult, companionHistory]
  );
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};
export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider');
  return ctx;
};
