import { label, t } from './i18n.js';
import * as engine from './engine.js';
import { createOutputView } from './outputView.js';
import { bindRunControls, runExclusive } from './state.js';

export function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

let idCounter = 0;
const uid = (name) => `${name}-${++idCounter}`;

/** A labelled textarea whose default text follows the language switch. */
export function promptField(labelKey, promptKey, rows = 3) {
  const wrap = el('div', 'field');
  const id = uid('prompt');
  const lab = el('label', 'field-label', { for: id });
  label(lab, labelKey);
  const area = el('textarea', '', { id, rows: String(rows) });
  area.dataset.i18nPrompt = promptKey;
  area.value = t(promptKey);
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

/** Run + Stop buttons, optional thinking switch, and a hint line explaining disabled state. */
export function runControls(runKey = 'box.run', withThink = true) {
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
export async function streamInto(outEl, { messages, thinking, temperature }) {
  const view = createOutputView(outEl, { thinking });
  try {
    const result = await engine.stream({ messages, thinking, temperature }, view.update);
    view.finish(result);
  } catch (error) {
    view.finish({ error });
  }
}

const ROLE_PRESETS = ['copywriter', 'kids', 'critic', 'own'];

function rolePicker() {
  const wrap = el('div', 'field');
  const id = uid('role');
  const lab = el('label', 'field-label', { for: id });
  label(lab, 'role.roleLabel');
  const select = el('select', '', { id });
  ROLE_PRESETS.forEach((name) => {
    const opt = el('option', '', { value: name });
    label(opt, `role.pick.${name}`);
    select.append(opt);
  });
  const area = el('textarea', '', { rows: '2', 'aria-label': t('role.roleLabel') });
  const setRole = (name) => {
    area.dataset.i18nPrompt = `role.${name}`;
    area.value = t(`role.${name}`);
  };
  select.addEventListener('change', () => {
    setRole(select.value);
    if (select.value === 'own') area.focus();
  });
  setRole(ROLE_PRESETS[0]);
  wrap.append(lab, select, area);
  return { wrap, area };
}

/**
 * Generic prompt box.
 * @param {HTMLElement} mount
 * @param {{ promptKey: string, labelKey?: string, withRole?: boolean, rows?: number, temperature?: number }} opts
 */
export function mountTryBox(mount, { promptKey, labelKey = 'box.prompt', withRole = false, rows = 3, temperature = 0.7 }) {
  const box = el('div', 'box');
  const role = withRole ? rolePicker() : null;
  const prompt = promptField(withRole ? 'role.taskLabel' : labelKey, promptKey, rows);
  const { controls, run, stopBtn, hint, think } = runControls();
  const out = el('div', 'output');
  if (role) box.append(role.wrap);
  box.append(prompt.wrap, controls, out);
  mount.append(box);

  run.addEventListener('click', () => {
    const messages = [];
    if (role && role.area.value.trim()) messages.push({ role: 'system', content: role.area.value.trim() });
    messages.push({ role: 'user', content: prompt.area.value });
    runExclusive(() => streamInto(out, { messages, thinking: think.checked, temperature }), stopBtn, hint);
  });
}
