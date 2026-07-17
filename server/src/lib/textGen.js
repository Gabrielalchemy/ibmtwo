// Text generation via Groq — free, no card required, OpenAI-compatible chat
// completions API. Fast inference on open models like Llama 3.3.

const GROQ_MODEL_ID = process.env.GROQ_MODEL_ID || 'llama-3.3-70b-versatile';

async function callGroq(systemPrompt, userPrompt, maxTokens) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set. Add it to server/.env');
  }

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL_ID,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq request failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('No content returned from Groq');
  }
  return content.trim();
}

/**
 * Calls Groq and expects a JSON object back.
 * @param {string} systemPrompt - instructions, must tell the model to return ONLY JSON.
 * @param {string} userPrompt - the actual request content.
 * @param {number} maxTokens
 * @returns {Promise<object>} parsed JSON object
 */
export async function generateStructuredJSON(systemPrompt, userPrompt, maxTokens = 1500) {
  const raw = await callGroq(systemPrompt, userPrompt, maxTokens);
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Groq did not return valid JSON: ${err.message}\nRaw: ${cleaned.slice(0, 300)}`);
  }
}

/**
 * Calls Groq for plain text (non-JSON) generation, e.g. conversational companion replies.
 */
export async function generateText(systemPrompt, userPrompt, maxTokens = 800) {
  return callGroq(systemPrompt, userPrompt, maxTokens);
}
