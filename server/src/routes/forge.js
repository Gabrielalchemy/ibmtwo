import { Router } from 'express';
import { generateStructuredJSON } from '../lib/textGen.js';

const router = Router();

const FORGE_SYSTEM_PROMPT = `You are ForgeAI, part of Studio AI. Given a short game concept, you produce a world bible summary and a lightweight game design document (GDD).
Return ONLY a JSON object, no preamble, no markdown fences, matching exactly this shape:
{
  "project_name": "string, a short evocative project title",
  "world_bible_summary": "string, 3-5 sentences establishing setting, tone, and core conflict",
  "pillars": ["string", "string", "string"],
  "gdd": {
    "genre": "string",
    "core_loop": "string",
    "player_fantasy": "string",
    "target_audience": "string"
  }
}`;

// POST /forge/gdd - generate world bible + GDD from a free-text concept
router.post('/gdd', async (req, res) => {
  const { concept } = req.body;

  if (!concept || typeof concept !== 'string') {
    return res.status(400).json({ error: 'concept (string) is required' });
  }

  try {
    const userPrompt = `Game concept / setting: "${concept}"\n\nGenerate the world bible and GDD.`;
    const result = await generateStructuredJSON(FORGE_SYSTEM_PROMPT, userPrompt);
    res.json(result);
  } catch (err) {
    console.error('[forge/gdd]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
