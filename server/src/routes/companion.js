import { Router } from 'express';
import { generateText } from '../lib/anthropic.js';

const router = Router();

// POST /companion/chat - free-form conversational reply, in-character with the project's world
router.post('/chat', async (req, res) => {
  const { message, worldBibleSummary, history } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message (string) is required' });
  }

  try {
    const systemPrompt = `You are SidekickAI, a friendly in-studio companion helping a game designer inside Studio AI. Stay concise and encouraging. World context: "${worldBibleSummary || 'No world bible yet.'}"`;

    const historyText = Array.isArray(history) && history.length
      ? history.map((h) => `${h.role}: ${h.content}`).join('\n') + '\n'
      : '';

    const reply = await generateText(systemPrompt, `${historyText}user: ${message}`);
    res.json({ reply });
  } catch (err) {
    console.error('[companion/chat]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;