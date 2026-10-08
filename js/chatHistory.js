/** Assemble the message list the model sees: system prompt, earlier turns, new input. */
export function buildMessages({ system = '', history = [], input }) {
  const messages = [];
  if (system.trim()) messages.push({ role: 'system', content: system.trim() });
  messages.push(...history, { role: 'user', content: input });
  return messages;
}
