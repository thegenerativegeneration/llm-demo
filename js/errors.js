/**
 * Sort WebLLM errors into what the user can do about them:
 * 'lost'    — the model is gone (GPU device lost / unloaded), load it again
 * 'context' — the conversation no longer fits, start over
 * 'other'   — show the message
 */
export function classifyError(error) {
  const name = error?.name ?? '';
  const message = String(error?.message ?? error);
  if (name === 'DeviceLostError' || name === 'ModelNotLoadedError' || /device.*lost|not loaded/i.test(message)) return 'lost';
  if (name === 'ContextWindowSizeExceededError' || /context window/i.test(message)) return 'context';
  return 'other';
}
