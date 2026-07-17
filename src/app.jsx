import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext.jsx';
import Navbar from './components/Navbar.jsx';
import Layout from './layout/Layout.jsx';
import Landing from './pages/Landing.jsx';
import StudioDashboard from './pages/StudioDashboard.jsx';
import ForgePage from './pages/ForgePage.jsx';
import CharactersPage from './pages/CharactersPage.jsx';
import StoryPage from './pages/StoryPage.jsx';
import PanelsPage from './pages/PanelsPage.jsx';
import PlaytestPage from './pages/PlaytestPage.jsx';
import CompanionPage from './pages/CompanionPage.jsx';
const App = () => {
  return (
    <StudioProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/studio" element={<Layout />}>
          <Route index element={<StudioDashboard />} />
          <Route path="forge" element={<ForgePage />} />
          <Route path="characters" element={<CharactersPage />} />
          <Route path="story" element={<StoryPage />} />
          <Route path="panels" element={<PanelsPage />} />
          <Route path="playtest" element={<PlaytestPage />} />
          <Route path="companion" element={<CompanionPage />} />
        </Route>
      </Routes>
    </StudioProvider>
  );
};
export default App;