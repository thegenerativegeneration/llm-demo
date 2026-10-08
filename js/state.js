import { createRunLock } from './runLock.js';
import { label, t } from './i18n.js';
import { stop } from './engine.js';

export const runLock = createRunLock();

let ready = false;
const modelListeners = [];

export const modelReady = () => ready;
export function setModelReady(value) {
  ready = value;
  modelListeners.forEach((fn) => fn(value));
}

/**
 * Keep run buttons in sync with model + lock state, and tell the user why a
 * button is disabled instead of silently greying it out.
 */
export function bindRunControls(buttons, hintEl) {
  const refresh = () => {
    const reason = !ready ? 'box.needModel' : runLock.busy() ? 'box.busy' : null;
    buttons.forEach((b) => {
      b.disabled = reason !== null;
      b.title = reason ? t(reason) : '';
    });
    if (reason && !hintEl.dataset.running) label(hintEl, reason);
    else if (!hintEl.dataset.running) {
      hintEl.textContent = '';
      delete hintEl.dataset.i18n;
    }
  };
  runLock.subscribe(refresh);
  modelListeners.push(refresh);
  refresh();
}

/**
 * Run `fn` while holding the lock. `stopBtn` is shown only for this run.
 * Returns false if another run was already active.
 */
export async function runExclusive(fn, stopBtn, hintEl) {
  if (!runLock.acquire()) return false;
  hintEl.dataset.running = '1';
  hintEl.textContent = '';
  delete hintEl.dataset.i18n;
  stopBtn.hidden = false;
  const onStop = () => stop();
  stopBtn.addEventListener('click', onStop);
  try {
    await fn();
  } finally {
    stopBtn.removeEventListener('click', onStop);
    stopBtn.hidden = true;
    delete hintEl.dataset.running;
    runLock.release();
  }
  return true;
}
