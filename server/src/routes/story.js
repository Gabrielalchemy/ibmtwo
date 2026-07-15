import { Router } from 'express';
import { generateStructuredJSON } from '../lib/anthropic.js';

const router = Router();

const STORY_SYSTEM_PROMPT = `You are StoryForge, part of Studio AI. You generate a structured story outline for a game, broken into beats.
Return ONLY a JSON object, no preamble, no markdown fences, matching exactly this shape:
{
  "premise": "string",
  "act_structure": [
    { "act": "string, e.g. Act 1", "summary": "string" }
  ],
  "beats": [
    { "title": "string", "description": "string", "characters_involved": ["string"] }
  ]
}`;

// POST /story/generate
router.post('/generate', async (req, res) => {
  const { worldBibleSummary, characters, direction } = req.body;

  if (!direction || typeof direction !== 'string') {
    return res.status(400).json({ error: 'direction (string) is required' });
  }

  try {
    const characterList = Array.isArray(characters) && characters.length
      ? characters.map((c) => c.name).filter(Boolean).join(', ')
      : 'none specified yet';

    const userPrompt = `World context: "${worldBibleSummary || 'No world bible yet.'}"\nKnown characters: ${characterList}\nStory direction / request: "${direction}"\n\nGenerate the story outline.`;
    const result = await generateStructuredJSON(STORY_SYSTEM_PROMPT, userPrompt);
    res.json(result);
  } catch (err) {
    console.error('[story/generate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;