import Anthropic from '@anthropic-ai/sdk';

let client = null;

function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Add it to server/.env');
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/**
 * Calls Claude and expects a JSON object back.
 * @param {string} systemPrompt - instructions, must tell Claude to return ONLY JSON.
 * @param {string} userPrompt - the actual request content.
 * @param {number} maxTokens
 * @returns {Promise<object>} parsed JSON object
 */
export async function generateStructuredJSON(systemPrompt, userPrompt, maxTokens = 1500) {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error('No text content returned from Claude');
  }

  const raw = textBlock.text.trim();
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Claude did not return valid JSON: ${err.message}\nRaw: ${cleaned.slice(0, 300)}`);
  }
}

/**
 * Calls Claude for plain text (non-JSON) generation, e.g. conversational companion replies.
 */
export async function generateText(systemPrompt, userPrompt, maxTokens = 800) {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-5',
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text.trim() : '';
}