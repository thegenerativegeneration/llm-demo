import { label, onLangChange } from './i18n.js';
import * as engine from './engine.js';
import { detectGpu, MODELS } from './models.js';
import { runLock, setModelReady, setGpuOk, onModelChange } from './state.js';
import { el } from './ui.js';

const STORAGE_KEY = 'llm-basics-model';

function savedSize() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v in MODELS ? v : 'small';
  } catch {
    return 'small';
  }
}

function errorMessage(error) {
  if (error.code) return { key: `err.${error.code}` };
  const msg = String(error.message || error);
  if (/memory|OOM|allocation|device lost/i.test(msg)) return { key: 'err.memory' };
  if (/shader-f16/i.test(msg)) return { key: 'err.no-adapter' };
  if (/exceeds limit/i.test(msg)) return { key: 'err.limits' };
  return { key: 'err.download', vars: { msg } };
}

function modelOption(size, checked) {
  const opt = el('label', 'model-option');
  const input = el('input', '', { type: 'radio', name: 'model-size', value: size });
  input.checked = checked;
  const text = el('div');
  const name = el('strong');
  label(name, `start.${size}`);
  const note = el('span');
  label(note, `start.${size}Note`);
  text.append(name, note);
  opt.append(input, text);
  return { opt, input };
}

const pill = () => document.getElementById('model-pill');
function setPill(state, key, vars) {
  pill().dataset.state = state;
  label(pill(), key, vars);
}

export async function mountLoader(mount) {
  const box = el('div', 'box');
  const gpuLine = el('p', 'gpu');
  label(gpuLine, 'gpu.checking');
  const models = el('div', 'models', { role: 'radiogroup' });
  const initial = savedSize();
  const options = Object.keys(MODELS).map((size) => modelOption(size, size === initial));
  options.forEach(({ opt }) => models.append(opt));
  const controls = el('div', 'controls');
  const loadBtn = el('button', 'btn accent', { type: 'button' });
  label(loadBtn, 'start.load');
  controls.append(loadBtn);
  const progress = el('progress', '', { max: '1', value: '0' });
  progress.hidden = true;
  const status = el('p', 'status', { role: 'status' });
  const note = el('p', 'hint');
  label(note, 'start.note');
  box.append(gpuLine, models, controls, progress, status, note);
  mount.append(box);

  const selected = () => options.find((o) => o.input.checked).input.value;
  let gpuOk = false;
  let loading = false;
  const refresh = () => {
    const sameAsLoaded = engine.currentSize() === selected();
    loadBtn.disabled = !gpuOk || loading || runLock.busy() || sameAsLoaded;
  };
  runLock.subscribe(refresh);
  options.forEach(({ input }) => input.addEventListener('change', refresh));

  const gpu = await detectGpu(navigator);
  gpuOk = gpu.ok;
  setGpuOk(gpu.ok);
  onModelChange((ready) => {
    if (ready || loading) return;
    setPill('none', 'pill.none');
    label(loadBtn, 'start.load');
    refresh();
  });
  label(gpuLine, gpu.ok ? 'gpu.ok' : gpu.reason === 'limits' ? 'gpu.limits' : 'gpu.none');
  gpuLine.classList.toggle('bad', !gpu.ok);
  refresh();

  let lastPct = 0;
  const showProgress = (fraction) => {
    lastPct = Math.round(fraction * 100);
    progress.value = fraction;
    label(status, 'load.loading');
    status.textContent += ` ${lastPct} %`;
    setPill('loading', 'pill.loading');
  };
  // the percentage is appended by hand, so re-append it after a language switch
  onLangChange(() => {
    if (loading) status.textContent += ` ${lastPct} %`;
  });

  loadBtn.addEventListener('click', async () => {
    if (!runLock.acquire()) return;
    const size = selected();
    loading = true;
    refresh();
    setModelReady(false);
    progress.hidden = false;
    status.classList.remove('warn');
    showProgress(0);
    try {
      await engine.load(size, showProgress);
      try {
        localStorage.setItem(STORAGE_KEY, size);
      } catch {
        // not persisted; fine
      }
      progress.hidden = true;
      label(status, 'load.ready', { name: `Qwen3 ${MODELS[size].base.split('-')[1]}` });
      label(loadBtn, 'start.switch');
      setPill('ready', 'pill.ready', { name: `Qwen3 ${MODELS[size].base.split('-')[1]}` });
      setModelReady(true);
    } catch (error) {
      progress.hidden = true;
      const { key, vars } = errorMessage(error);
      status.classList.add('warn');
      label(status, key, vars);
      // a failed switch leaves no usable model
      setModelReady(engine.isReady());
      if (!engine.isReady()) setPill('none', 'pill.none');
    } finally {
      loading = false;
      runLock.release();
      refresh();
    }
  });
}
