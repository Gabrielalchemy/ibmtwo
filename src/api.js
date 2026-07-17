import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// ForgeAI - world bible + GDD
export const generateForgeGDD = (payload) => api.post('/forge/gdd', payload);

// CharacterForge - text profile + portrait image
export const generateCharacter = (payload) => api.post('/characters/generate', payload);
export const generateCharacterPortrait = (payload) => api.post('/characters/portrait', payload);
export const generateCharacterModel3D = (payload) => api.post('/characters/model3d', payload);

// StoryForge - narrative outline
export const generateStory = (payload) => api.post('/story/generate', payload);

// PanelQuest - storyboard + panel illustration
export const generatePanels = (payload) => api.post('/panels/generate', payload);
export const illustratePanel = (payload) => api.post('/panels/illustrate', payload);

// QuestAI - playtest simulation
export const simulatePlaytest = (payload) => api.post('/playtest/simulate', payload);

// SidekickAI - companion chat
export const sendCompanionMessage = (payload) => api.post('/companion/chat', payload);

// Health check - useful for a "backend connected" indicator in the UI
export const checkBackendHealth = () => api.get('/health');

export default api;