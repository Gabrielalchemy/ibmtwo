import { Router } from 'express';
import { generateStructuredJSON } from '../lib/textGen.js';

const router = Router();

const PLAYTEST_SYSTEM_PROMPT = `You are QuestAI, part of Studio AI. You simulate a playtester's reaction to a game concept/GDD and surface likely issues.
Return ONLY a JSON object, no preamble, no markdown fences, matching exactly this shape:
{
  "overall_impression": "string",
  "strengths": ["string", "string"],
  "concerns": ["string", "string"],
  "suggested_playtest_questions": ["string", "string", "string"]
}`;

// POST /playtest/simulate
router.post('/simulate', async (req, res) => {
  const { gdd, worldBibleSummary } = req.body;

  if (!gdd) {
    return res.status(400).json({ error: 'gdd (object or string) is required' });
  }

  try {
    const gddText = typeof gdd === 'string' ? gdd : JSON.stringify(gdd, null, 2);
    const userPrompt = `World context: "${worldBibleSummary || 'No world bible yet.'}"\nGDD:\n${gddText}\n\nSimulate a playtester's reaction.`;
    const result = await generateStructuredJSON(PLAYTEST_SYSTEM_PROMPT, userPrompt);
    res.json(result);
  } catch (err) {
    console.error('[playtest/simulate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;