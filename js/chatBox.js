import { label, t } from './i18n.js';
import { buildMessages } from './chatHistory.js';
import { splitThinking } from './thinking.js';
import { runExclusive } from './state.js';
import { el, uid, promptField, temperatureSlider, runControls, streamInto } from './ui.js';

const ROLE_PRESETS = ['copywriter', 'kids', 'critic', 'own'];
const TESTS = ['count', 'bio', 'sources', 'date'];

function rolePicker(presets) {
  const wrap = el('div', 'field');
  const id = uid('role');
  const lab = el('label', 'field-label', { for: id });
  label(lab, 'role.roleLabel');
  const select = el('select', '', { id });
  presets.forEach((name) => {
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
    if (select.value === 'own') area.select();
  });
  setRole(presets[0]);
  wrap.append(lab, select, area);
  return { wrap, area };
}

/** Preset failure tests as chips; picking one fills the prompt and shows why it is interesting. */
function testChips(area) {
  const wrap = el('div', 'field');
  const lab = el('span', 'field-label');
  label(lab, 'play.tests');
  const row = el('div', 'chips');
  const note = el('p', 'note');
  TESTS.forEach((name) => {
    const chip = el('button', 'chip', { type: 'button' });
    label(chip, `fail.${name}H`);
    chip.addEventListener('click', () => {
      area.dataset.i18nPrompt = `fail.${name}`;
      area.value = t(`fail.${name}`);
      label(note, `fail.${name}Note`);
      row.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      area.focus();
    });
    row.append(chip);
  });
  wrap.append(lab, row, note);
  return wrap;
}

function bubble(role) {
  const b = el('div', `bubble ${role}`);
  const who = el('span', 'who');
  label(who, role === 'user' ? 'chat.you' : 'chat.model');
  const body = el('div', 'bubble-body');
  b.append(who, body);
  return { b, body };
}

/**
 * One exercise box. Each flag switches on one control, so slides can add
 * controls step by step.
 */
export function mountChatBox(mount, opts) {
  const { promptKey, labelKey = 'box.prompt', rows = 3, system = false, history = false, temperature = false, think = false, tests = false } = opts;
  const box = el('div', 'box');
  // the playground starts without a role so the failure tests behave like plain chat
  const role = system ? rolePicker(tests ? ['none', ...ROLE_PRESETS] : ROLE_PRESETS) : null;
  const temp = temperature ? temperatureSlider(0.7) : null;
  const prompt = promptField(system ? 'role.taskLabel' : labelKey, promptKey, rows);
  const { controls, run, stopBtn, hint, think: thinkInput } = runControls(history ? 'chat.send' : 'box.run', think);
  const thread = history ? el('div', 'thread') : null;
  const out = history ? null : el('div', 'output');
  const turns = [];

  if (role) box.append(role.wrap);
  if (thread) box.append(thread);
  if (tests) box.append(testChips(prompt.area));
  box.append(prompt.wrap);
  if (temp) box.append(temp.wrap);
  box.append(controls);
  if (out) box.append(out);

  let reread = null;
  if (history) {
    const forget = el('button', 'btn secondary', { type: 'button' });
    label(forget, 'chat.forget');
    controls.insertBefore(forget, hint);
    reread = el('p', 'status');
    box.append(reread);
    forget.addEventListener('click', () => {
      turns.length = 0;
      thread.replaceChildren();
      reread.textContent = '';
    });
  }
  mount.append(box);

  const settings = () => ({
    thinking: thinkInput?.checked ?? false,
    temperature: temp ? Number(temp.input.value) : 0.7,
  });

  async function send() {
    const input = prompt.area.value.trim();
    if (!input) return;
    const messages = buildMessages({ system: role?.area.value ?? '', history: turns, input });
    if (!history) {
      await streamInto(out, { messages, ...settings() });
      return;
    }
    const user = bubble('user');
    user.body.textContent = input;
    const model = bubble('model');
    thread.append(user.b, model.b);
    prompt.area.value = '';
    delete prompt.area.dataset.i18nPrompt;
    model.b.scrollIntoView({ block: 'nearest' });
    const result = await streamInto(model.body, { messages, ...settings() });
    if (result) {
      // earlier thoughts are not sent back, as Qwen3's chat template expects
      turns.push({ role: 'user', content: input }, { role: 'assistant', content: splitThinking(result.text).answer });
      label(reread, 'chat.reread', { n: turns.length });
    }
  }

  run.addEventListener('click', () => runExclusive(send, stopBtn, hint));
  prompt.area.addEventListener('keydown', (e) => {
    if (history && e.key === 'Enter' && !e.shiftKey && !run.disabled) {
      e.preventDefault();
      run.click();
    }
  });
}
