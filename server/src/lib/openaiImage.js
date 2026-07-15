import OpenAI from 'openai';

let client = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Add it to server/.env');
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

/**
 * Generates an image with gpt-image-1 and returns a base64 PNG string.
 * @param {string} prompt
 * @param {'1024x1024'|'1024x1536'|'1536x1024'} size
 * @returns {Promise<string>} base64-encoded PNG (no data: prefix)
 */
export async function generateImage(prompt, size = '1024x1024') {
  const openai = getClient();

  const response = await openai.images.generate({
    model: 'gpt-image-1',
    prompt,
    size,
    n: 1,
  });

  const image = response.data?.[0];
  if (!image?.b64_json) {
    throw new Error('No image data returned from gpt-image-1');
  }

  return image.b64_json;
}