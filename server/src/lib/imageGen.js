// Image generation via Pollinations.ai — free, no API key required.
// Docs: https://pollinations.ai

const SIZE_MAP = {
  '1024x1024': { width: 1024, height: 1024 },
  '1024x1536': { width: 1024, height: 1536 },
  '1536x1024': { width: 1536, height: 1024 },
};

/**
 * Generates an image via Pollinations and returns a base64 PNG string.
 * @param {string} prompt
 * @param {'1024x1024'|'1024x1536'|'1536x1024'} size
 * @returns {Promise<string>} base64-encoded image (no data: prefix)
 */
export async function generateImage(prompt, size = '1024x1024') {
  const { width, height } = SIZE_MAP[size] || SIZE_MAP['1024x1024'];
  const seed = Math.floor(Math.random() * 1_000_000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Pollinations request failed: ${res.status} ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}
