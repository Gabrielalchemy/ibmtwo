import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudio } from '../context/StudioContext.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
// SECTION: Studio dashboard - entry point listing all six modules
const MODULES = [
  { key: 'forge', path: 'forge', emoji: '📜', title: 'ForgeAI', description: 'Generate your world bible and GDD from a concept.' },
  { key: 'characters', path: 'characters', emoji: '🧑\u200d🎨', title: 'CharacterForge', description: 'Flesh out cast members and paint portraits.' },
  { key: 'story', path: 'story', emoji: '📖', title: 'StoryForge', description: 'Structure a premise, acts, and sequential beats.' },
  { key: 'panels', path: 'panels', emoji: '🎬', title: 'PanelQuest', description: 'Storyboard a beat and illustrate each panel.' },
  { key: 'playtest', path: 'playtest', emoji: '🧪', title: 'QuestAI', description: 'Simulate a playtester reacting to your GDD.' },
  { key: 'companion', path: 'companion', emoji: '💬', title: 'SidekickAI', description: 'Chat through ideas with your studio companion.' },
];

const StudioDashboard = () => {
  const navigate = useNavigate();
  const { project_name, completed_modules } = useStudio();

  const statusFor = (key) => {
    if (completed_modules.includes(key)) return 'done';
    if (key !== 'forge' && !completed_modules.includes('forge')) return 'locked';
    return 'available';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h2 className="text-xl font-semibold text-slate-50 mb-1">{project_name || 'Untitled Project'}</h2>
        <p className="text-sm text-slate-400">
          Six modules, one pipeline. Start with ForgeAI to establish your world, then build out cast, story, visuals, and playtesting.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULES.map((m) => (
          <ModuleCard
            key={m.key}
            title={m.title}
            emoji={m.emoji}
            description={m.description}
            status={statusFor(m.key)}
            primaryLabel={completed_modules.includes(m.key) ? 'Open Module' : 'Start'}
            onPrimary={() => navigate(`/studio/${m.path}`)}
          />
        ))}
      </div>
    </div>
  );
};
export default StudioDashboard;
