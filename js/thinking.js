const OPEN = '<think>';
const CLOSE = '</think>';

/**
 * Split raw Qwen3 output into its <think> part and the visible answer.
 * Works on partial (streaming) text: an unclosed or half-typed tag counts as
 * "still thinking" so raw tags never reach the screen.
 */
export function splitThinking(raw) {
  const text = raw.trimStart();
  if (text.length < OPEN.length && OPEN.startsWith(text)) {
    return { thoughts: '', answer: '', thinkingOpen: text.length > 0 };
  }
  if (!text.startsWith(OPEN)) {
    return { thoughts: '', answer: raw.trim(), thinkingOpen: false };
  }
  const end = text.indexOf(CLOSE);
  if (end === -1) {
    return { thoughts: text.slice(OPEN.length).trim(), answer: '', thinkingOpen: true };
  }
  return {
    thoughts: text.slice(OPEN.length, end).trim(),
    answer: text.slice(end + CLOSE.length).trim(),
    thinkingOpen: false,
  };
}
