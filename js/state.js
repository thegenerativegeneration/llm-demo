import { createRunLock } from './runLock.js';
import { label, t } from './i18n.js';
import { stop, markLost } from './engine.js';
import { classifyError } from './errors.js';

export const runLock = createRunLock();

let ready = false;
let gpuOk = true;
let activeRun = null;
const modelListeners = [];

export const modelReady = () => ready;
export const onModelChange = (fn) => modelListeners.push(fn);
export function setGpuOk(value) {
  gpuOk = value;
  modelListeners.forEach((fn) => fn(ready));
}
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
    const reason = !gpuOk ? 'box.noGpu' : !ready ? 'box.needModel' : runLock.busy() ? 'box.busy' : null;
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

/** Stop the running generation, e.g. when the user leaves the slide. */
export function stopActiveRun() {
  if (!activeRun) return;
  activeRun.stopped = true;
  stop();
}

/**
 * Turn a failed run into a message key. A lost model is marked as unloaded
 * so the UI stops claiming it is ready.
 */
export function describeRunError(error) {
  const kind = classifyError(error);
  if (kind === 'lost') {
    markLost();
    setModelReady(false);
    return { key: 'err.lost' };
  }
  if (kind === 'context') return { key: 'err.context' };
  return { key: 'out.error', vars: { msg: error?.message || String(error) } };
}

/**
 * Run `fn(run)` while holding the lock; `run.stopped` turns true when the user
 * stops, so multi-step runs can skip their remaining steps. `stopBtn` is shown only for this run.
 * Returns false if another run was already active.
 */
export async function runExclusive(fn, stopBtn, hintEl) {
  if (!runLock.acquire()) return false;
  hintEl.dataset.running = '1';
  hintEl.textContent = '';
  delete hintEl.dataset.i18n;
  stopBtn.hidden = false;
  const run = { stopped: false };
  activeRun = run;
  const onStop = () => {
    run.stopped = true;
    stop();
  };
  stopBtn.addEventListener('click', onStop);
  try {
    await fn(run);
  } finally {
    activeRun = null;
    stopBtn.removeEventListener('click', onStop);
    stopBtn.hidden = true;
    delete hintEl.dataset.running;
    runLock.release();
  }
  return true;
}
