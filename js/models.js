export const MODELS = {
  small: { base: 'Qwen3-0.6B', download: '≈ 0.5 GB' },
  better: { base: 'Qwen3-1.7B', download: '≈ 1.2 GB' },
};

/** GPUs without the shader-f16 feature need the (larger) f32 build. */
export function pickModelId(size, hasF16) {
  return `${MODELS[size].base}-${hasF16 ? 'q4f16_1' : 'q4f32_1'}-MLC`;
}

export async function detectGpu(nav) {
  if (!nav.gpu) return { ok: false, hasF16: false, reason: 'no-webgpu' };
  let adapter = null;
  try {
    adapter = await nav.gpu.requestAdapter();
  } catch {
    // treated the same as "no adapter"
  }
  if (!adapter) return { ok: false, hasF16: false, reason: 'no-adapter' };
  return { ok: true, hasF16: adapter.features.has('shader-f16') };
}
