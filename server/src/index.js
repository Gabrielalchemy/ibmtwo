import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import forgeRoutes from './routes/forge.js';
import charactersRoutes from './routes/characters.js';
import storyRoutes from './routes/story.js';
import panelsRoutes from './routes/panels.js';
import playtestRoutes from './routes/playtest.js';
import companionRoutes from './routes/companion.js';

const app = express();
const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '5mb' }));

// Simple health check - useful for confirming the server is up before wiring the frontend
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    anthropic_key_configured: Boolean(process.env.ANTHROPIC_API_KEY),
    openai_key_configured: Boolean(process.env.OPENAI_API_KEY),
  });
});

// One router per Studio AI module
app.use('/forge', forgeRoutes);
app.use('/characters', charactersRoutes);
app.use('/story', storyRoutes);
app.use('/panels', panelsRoutes);
app.use('/playtest', playtestRoutes);
app.use('/companion', companionRoutes);

// Fallback error handler so a thrown error never crashes the process silently
app.use((err, req, res, next) => {
  console.error('[unhandled]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Studio AI backend listening on http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not set - text generation routes will fail until you add it to server/.env');
  }
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - image generation routes will fail until you add it to server/.env');
  }
});