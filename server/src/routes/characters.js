import { Router } from 'express';
import { generateStructuredJSON } from '../lib/textGen.js';
import { generateImage } from '../lib/imageGen.js';
import { generate3DFromImage } from '../lib/tripoSR.js';

const router = Router();

const CHARACTER_SYSTEM_PROMPT = `You are CharacterForge, part of Studio AI. You generate structured character profiles for games.
Return ONLY a JSON object, no preamble, no markdown fences, matching exactly this shape:
{
  "name": "string",
  "role": "string, e.g. protagonist, rival, mentor",
  "appearance": "string, visual description suitable for an image generation prompt",
  "personality": "string, 2-3 sentences",
  "backstory": "string, 2-4 sentences",
  "voice_style": "string, how they speak"
}`;

// POST /characters/generate - text profile
router.post('/generate', async (req, res) => {
  const { worldBibleSummary, briefing } = req.body;

  if (!briefing || typeof briefing !== 'string') {
    return res.status(400).json({ error: 'briefing (string) is required' });
  }

  try {
    const userPrompt = `World context: "${worldBibleSummary || 'No world bible yet.'}"\n\nCharacter briefing: "${briefing}"\n\nGenerate the character profile.`;
    const result = await generateStructuredJSON(CHARACTER_SYSTEM_PROMPT, userPrompt);
    res.json(result);
  } catch (err) {
    console.error('[characters/generate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /characters/portrait - image generation
router.post('/portrait', async (req, res) => {
  const { appearance, name } = req.body;

  if (!appearance || typeof appearance !== 'string') {
    return res.status(400).json({ error: 'appearance (string) is required' });
  }

  try {
    const prompt = `Character portrait, digital painting style, waist-up composition. ${name ? `Character name: ${name}. ` : ''}Appearance: ${appearance}`;
    const b64_png = await generateImage(prompt);
    res.json({ b64_png });
  } catch (err) {
    console.error('[characters/portrait]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /characters/model3d - generates a 3D model from an existing portrait via TripoSR.
// This call blocks until the model is ready (the free Space's shared queue means
// it can take anywhere from ~30s to a few minutes).
router.post('/model3d', async (req, res) => {
  const { portrait_b64 } = req.body;

  if (!portrait_b64 || typeof portrait_b64 !== 'string') {
    return res.status(400).json({ error: 'portrait_b64 (string) is required - generate a portrait first' });
  }

  try {
    const model_url = await generate3DFromImage(portrait_b64);
    res.json({ model_url });
  } catch (err) {
    console.error('[characters/model3d]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;