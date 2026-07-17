// Image-to-3D generation via the free, open-source TripoSR model hosted as a
// public Hugging Face Space (stabilityai/TripoSR). No paid API required.
//
// Trade-off vs a dedicated paid API: this runs on Hugging Face's shared
// "ZeroGPU" community pool, so generation time varies with queue load
// (roughly 30s-few min). Passing an HF_TOKEN gives you your own daily GPU
// quota instead of the stricter shared/anonymous pool, so it's worth setting.
//
// The @gradio/client's predict() call blocks until the result is ready and
// handles the queue internally - there's no separate "check status" endpoint
// needed here (unlike Meshy's async task model).

import { Client, handle_file } from '@gradio/client';

const SPACE_ID = process.env.TRIPOSR_SPACE_ID || 'stabilityai/TripoSR';

let clientPromise = null;
function getClient() {
  if (!clientPromise) {
    clientPromise = Client.connect(SPACE_ID, {
      token: process.env.HF_TOKEN || undefined,
    });
  }
  return clientPromise;
}

/**
 * Turns a base64 PNG (no data: prefix) into a 3D model via TripoSR.
 * @param {string} base64Png
 * @returns {Promise<string>} a URL to the generated GLB file, hosted on the Space
 */
export async function generate3DFromImage(base64Png) {
  const client = await getClient();
  const buffer = Buffer.from(base64Png, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });

  // Step 1: preprocess (background removal + centering)
  const preprocessResult = await client.predict('/preprocess', {
    input_image: handle_file(blob),
    do_remove_background: true,
    foreground_ratio: 0.85,
  });
  const processedImage = preprocessResult.data?.[0];
  if (!processedImage) {
    throw new Error('TripoSR preprocessing step returned no image');
  }

  // Step 2: generate the mesh from the preprocessed image
  const generateResult = await client.predict('/generate', {
    image: processedImage,
    mc_resolution: 256,
  });

  // The Space returns [obj_file, glb_file] - we want the GLB for model-viewer
  const glbFile = generateResult.data?.[1];
  if (!glbFile?.url) {
    throw new Error('TripoSR did not return a downloadable GLB file');
  }
  return glbFile.url;
}
