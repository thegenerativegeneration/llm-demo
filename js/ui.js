import { label, t } from './i18n.js';
import * as engine from './engine.js';
import { createOutputView } from './outputView.js';
import { bindRunControls } from './state.js';

export function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

let idCounter = 0;
export const uid = (name) => `${name}-${++idCounter}`;

/** A labelled textarea whose default text follows the language switch until edited. */
export function promptField(labelKey, promptKey, rows = 3) {
  const wrap = el('div', 'field');
  const id = uid('prompt');
  const lab = el('label', 'field-label', { for: id });
  label(lab, labelKey);
  const area = el('textarea', '', { id, rows: String(rows) });
  if (promptKey) {
    area.dataset.i18nPrompt = promptKey;
    area.value = t(promptKey);
  }
  wrap.append(lab, area);
  return { wrap, area };
}

export function thinkSwitch() {
  const wrap = el('label', 'switch');
  const input = el('input', '', { type: 'checkbox', role: 'switch' });
  const text = el('span');
  label(text, 'box.think');
  wrap.dataset.i18nTitle = 'box.thinkHint';
  wrap.title = t('box.thinkHint');
  wrap.append(input, text);
  return { wrap, input };
}

export function temperatureSlider(initial = 0.7) {
  const wrap = el('div', 'field');
  const id = uid('temp');
  const lab = el('label', 'field-label', { for: id });
  label(lab, 'rand.temp');
  const row = el('div', 'slider');
  const low = el('span');
  label(low, 'rand.low');
  const input = el('input', '', { id, type: 'range', min: '0', max: '1.5', step: '0.1', value: String(initial) });
  const high = el('span');
  label(high, 'rand.high');
  const value = el('span', 'temp-value');
  const sync = () => (value.textContent = Number(input.value).toFixed(1));
  input.addEventListener('input', sync);
  sync();
  row.append(low, input, high, value);
  wrap.append(lab, row);
  return { wrap, input };
}

/** Run + Stop buttons, optional thinking switch, and a hint explaining a disabled state. */
export function runControls(runKey = 'box.run', withThink = false) {
  const controls = el('div', 'controls');
  const run = el('button', 'btn', { type: 'button' });
  label(run, runKey);
  const stopBtn = el('button', 'btn secondary', { type: 'button' });
  label(stopBtn, 'box.stop');
  stopBtn.hidden = true;
  const think = withThink ? thinkSwitch() : null;
  const hint = el('span', 'hint');
  controls.append(run, stopBtn);
  if (think) controls.append(think.wrap);
  controls.append(hint);
  bindRunControls([run], hint);
  return { controls, run, stopBtn, hint, think: think?.input };
}

/** Stream one chat answer into `outEl`. Never throws; errors are shown in the view. */
export async function streamInto(outEl, { messages, thinking = false, temperature = 0.7 }) {
  const view = createOutputView(outEl, { thinking });
  try {
    const result = await engine.stream({ messages, thinking, temperature }, view.update);
    view.finish(result);
    return result;
  } catch (error) {
    view.finish({ error });
    return null;
  }
}
