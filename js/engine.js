import { pickModelId, detectGpu } from './models.js';

const WEBLLM_URL = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm';

let engine = null;
let size = null;

/** Load (or switch to) a model. Throws an Error with `.code` for GPU problems. */
export async function load(nextSize, onProgress) {
  const gpu = await detectGpu(navigator);
  if (!gpu.ok) throw Object.assign(new Error(gpu.reason), { code: gpu.reason });
  const modelId = pickModelId(nextSize, gpu.hasF16);
  const report = (r) => onProgress(r.progress, r.text);
  size = null;
  if (engine) {
    engine.setInitProgressCallback(report);
    await engine.reload(modelId);
  } else {
    const webllm = await import(WEBLLM_URL);
    engine = await webllm.CreateMLCEngine(modelId, { initProgressCallback: report });
  }
  size = nextSize;
}

export const isReady = () => engine !== null && size !== null;
export const currentSize = () => size;

/**
 * Stream a chat completion. `onText` receives the full raw text so far
 * (including <think> blocks); split it with splitThinking().
 */
export async function stream({ messages, temperature = 0.7, thinking = false, maxTokens }, onText) {
  const chunks = await engine.chat.completions.create({
    messages,
    temperature,
    stream: true,
    stream_options: { include_usage: true },
    max_tokens: maxTokens ?? (thinking ? 1200 : 300),
    extra_body: { enable_thinking: thinking },
  });
  let text = '';
  let finishReason = null;
  let tokens = 0;
  for await (const chunk of chunks) {
    const choice = chunk.choices[0];
    if (choice?.delta?.content) {
      text += choice.delta.content;
      onText(text);
    }
    if (choice?.finish_reason) finishReason = choice.finish_reason;
    if (chunk.usage) tokens = chunk.usage.completion_tokens;
  }
  return { text, finishReason, tokens };
}

/** The k most likely next tokens after `prompt` (plain text, no chat template). */
export async function nextTokens(prompt, k = 5) {
  const r = await engine.completions.create({
    prompt,
    max_tokens: 1,
    logprobs: true,
    top_logprobs: k,
    temperature: 1,
  });
  return r.choices[0].logprobs.content[0].top_logprobs.map((t) => ({
    token: t.token,
    prob: Math.exp(t.logprob),
  }));
}

export const stop = () => engine?.interruptGenerate();
