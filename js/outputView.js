import { splitThinking } from './thinking.js';
import { label } from './i18n.js';

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

const secs = (ms) => (ms / 1000).toFixed(ms < 10000 ? 1 : 0);

/**
 * Renders one streamed answer: an optional "Thoughts" panel (like the
 * "Thought for N s" fold-out in ChatGPT/Claude) above the answer text.
 * All model text goes through textContent.
 */
export function createOutputView(container, { thinking }) {
  container.replaceChildren();
  const details = el('details', 'thoughts');
  const summary = el('summary');
  const thoughtText = el('pre', 'thought-text');
  details.append(summary, thoughtText);
  details.open = true;
  details.hidden = true;
  const answer = el('pre', 'answer');
  const status = el('p', 'status');
  status.setAttribute('role', 'status');
  container.append(details, answer, status);

  const started = performance.now();
  let thinkEnded = null;
  let last = { thoughts: '', answer: '', thinkingOpen: false };

  function update(raw) {
    last = splitThinking(raw);
    // before the first token arrives, a thinking run counts as already thinking
    const open = last.thinkingOpen || (thinking && raw.trim() === '');
    if (thinking) {
      details.hidden = false;
      if (open) {
        label(summary, 'out.thinking');
        summary.classList.add('pulse');
        thoughtText.textContent = last.thoughts;
        thoughtText.scrollTop = thoughtText.scrollHeight;
      } else {
        if (thinkEnded === null) thinkEnded = performance.now();
        summary.classList.remove('pulse');
        label(summary, 'out.thoughtFor', { s: secs(thinkEnded - started) });
        thoughtText.textContent = last.thoughts;
      }
    }
    answer.textContent = last.answer;
    answer.classList.toggle('pulse', !(thinking && open));
  }

  function finish({ finishReason, tokens, error }) {
    answer.classList.remove('pulse');
    summary.classList.remove('pulse');
    if (thinking && !last.thoughts) details.hidden = true;
    status.classList.remove('warn');
    if (error) {
      status.classList.add('warn');
      label(status, 'out.error', { msg: error.message || String(error) });
      return;
    }
    if (finishReason === 'abort') {
      label(status, 'out.stopped');
    } else if (finishReason === 'length') {
      status.classList.add('warn');
      label(status, last.thinkingOpen ? 'out.cappedThinking' : 'out.capped');
    } else {
      label(status, 'out.stats', { n: tokens, s: secs(performance.now() - started) });
    }
  }

  update('');
  return { update, finish };
}
