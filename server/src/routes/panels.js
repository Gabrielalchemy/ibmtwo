import { Router } from 'express';
import { generateStructuredJSON } from '../lib/textGen.js';
import { generateImage } from '../lib/imageGen.js';

const router = Router();

const PANEL_SYSTEM_PROMPT = `You are PanelQuest, part of Studio AI. You break a story beat into a sequence of visual panels (like a comic storyboard or cutscene).
Return ONLY a JSON object, no preamble, no markdown fences, matching exactly this shape:
{
  "panels": [
    { "order": 1, "scene_description": "string, visual description suitable for an image prompt", "dialogue": "string or empty string" }
  ]
}`;

// POST /panels/generate - text-only storyboard (fast, no images)
router.post('/generate', async (req, res) => {
  const { beat } = req.body;

  if (!beat || typeof beat !== 'string') {
    return res.status(400).json({ error: 'beat (string) is required' });
  }

  try {
    const userPrompt = `Story beat to storyboard: "${beat}"\n\nBreak it into 3-6 sequential panels.`;
    const result = await generateStructuredJSON(PANEL_SYSTEM_PROMPT, userPrompt);
    res.json(result);
  } catch (err) {
    console.error('[panels/generate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /panels/illustrate - generate an image for a single panel's scene_description
router.post('/illustrate', async (req, res) => {
  const { scene_description } = req.body;

  if (!scene_description || typeof scene_description !== 'string') {
    return res.status(400).json({ error: 'scene_description (string) is required' });
  }

  try {
    const prompt = `Comic panel illustration, dynamic composition: ${scene_description}`;
    const b64_png = await generateImage(prompt, '1024x1536');
    res.json({ b64_png });
  } catch (err) {
    console.error('[panels/illustrate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;