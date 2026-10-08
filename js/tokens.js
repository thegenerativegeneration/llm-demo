import { label, t } from './i18n.js';
import * as engine from './engine.js';
import { runExclusive, bindRunControls, runLock, describeRunError } from './state.js';
import { displayToken, toPercent, isBrokenToken } from './tokenFormat.js';
import { el, promptField } from './ui.js';

function sample(candidates) {
  const total = candidates.reduce((sum, c) => sum + c.prob, 0);
  let r = Math.random() * total;
  for (const c of candidates) {
    r -= c.prob;
    if (r <= 0) return c;
  }
  return candidates[candidates.length - 1];
}

/** Slide 2: the five most likely next tokens as bars; click one to append it. */
export function mountTokens(mount) {
  const box = el('div', 'box');
  const prompt = promptField('box.prompt', 'tokens.start', 2);
  prompt.area.classList.add('token-text');
  const controls = el('div', 'controls');
  const show = el('button', 'btn', { type: 'button' });
  label(show, 'tokens.show');
  const auto = el('button', 'btn secondary', { type: 'button' });
  label(auto, 'tokens.auto');
  const reset = el('button', 'btn secondary', { type: 'button' });
  label(reset, 'tokens.reset');
  const hint = el('span', 'hint');
  const stopBtn = el('button', 'btn secondary', { type: 'button' });
  stopBtn.hidden = true;
  controls.append(show, auto, reset, hint);
  const list = el('div', 'candidates', { role: 'list' });
  const legend = el('p', 'hint');
  label(legend, 'tokens.legend');
  const status = el('p', 'status', { role: 'status' });
  box.append(prompt.wrap, controls, list, legend, status);
  mount.append(box);
  bindRunControls([show, auto], hint);

  let candidates = [];
  const setEnabled = (on) => list.querySelectorAll('button').forEach((b) => (b.disabled = !on));

  function otherRow() {
    const rest = Math.max(0, 1 - candidates.reduce((sum, c) => sum + c.prob, 0));
    const row = el('div', 'cand other', { role: 'listitem' });
    const tok = el('span', 'tok');
    label(tok, 'tokens.other');
    const bar = el('span', 'bar');
    const fill = el('i');
    fill.style.width = `${Math.round(rest * 100)}%`;
    bar.append(fill);
    const pct = el('span', 'pct');
    pct.textContent = toPercent(rest);
    row.append(tok, bar, pct);
    return row;
  }

  function render() {
    list.replaceChildren(
      ...candidates.map((c) => {
        const b = el('button', 'cand', { type: 'button', role: 'listitem' });
        const tok = el('span', 'tok');
        tok.textContent = displayToken(c.token);
        const bar = el('span', 'bar');
        const fill = el('i');
        fill.style.width = `${Math.max(1, Math.round(c.prob * 100))}%`;
        bar.append(fill);
        const pct = el('span', 'pct');
        pct.textContent = toPercent(c.prob);
        b.append(tok, bar, pct);
        if (isBrokenToken(c.token)) {
          // half of a multi-byte character: appending it would corrupt the text
          b.disabled = true;
          b.dataset.i18nTitle = 'tokens.broken';
          b.title = t('tokens.broken');
        } else {
          b.addEventListener('click', () => choose(c));
        }
        return b;
      }),
      otherRow(),
    );
  }

  const fetchNext = () =>
    runExclusive(
      async () => {
        setEnabled(false);
        status.textContent = '';
        try {
          candidates = await engine.nextTokens(prompt.area.value, 5);
          render();
        } catch (error) {
          const { key, vars } = describeRunError(error);
          label(status, key, vars);
        }
      },
      stopBtn,
      hint,
    );

  function choose(c) {
    if (runLock.busy()) return;
    prompt.area.value += c.token;
    delete prompt.area.dataset.i18nPrompt;
    fetchNext();
  }

  show.addEventListener('click', fetchNext);
  auto.addEventListener('click', async () => {
    if (!candidates.length) await fetchNext();
    const usable = candidates.filter((c) => !isBrokenToken(c.token));
    if (usable.length) choose(sample(usable));
  });
  reset.addEventListener('click', () => {
    prompt.area.dataset.i18nPrompt = 'tokens.start';
    prompt.area.value = t('tokens.start');
    candidates = [];
    list.replaceChildren();
    status.textContent = '';
  });
  prompt.area.addEventListener('input', () => {
    candidates = [];
    list.replaceChildren();
  });
}
