import React, { createContext, useContext, useState, useMemo } from 'react';
const StudioContext = createContext(null);
export const StudioProvider = ({ children }) => {
  const [projectId, setProjectId] = useState(null);
  const [projectName, setProjectName] = useState('Untitled Project');
  const [completedModules, setCompletedModules] = useState([]); // e.g. ['forge', 'characters']
  const [worldBibleSummary, setWorldBibleSummary] = useState('No lore generated yet. Run ForgeAI to create your world bible.');
  const value = useMemo(
    () => ({
      project_id: projectId,
      setProjectId,
      project_name: projectName,
      setProjectName,
      completed_modules: completedModules,
      setCompletedModules,
      world_bible_summary: worldBibleSummary,
      setWorldBibleSummary,
    }),
    [projectId, projectName, completedModules, worldBibleSummary]
  );
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};
export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within a StudioProvider');
  return ctx;
};