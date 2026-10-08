import en from './text-en.js';
import de from './text-de.js';

const DICTS = { en, de };
const STORAGE_KEY = 'llm-basics-lang';

export function makeT(dicts, lang) {
  return (key) => dicts[lang]?.[key] ?? dicts.en?.[key] ?? key;
}

/** A prompt box is re-filled on language change only if the user hasn't edited it. */
export function shouldReplacePrompt(current, oldDefault) {
  return current.trim() === '' || current === oldDefault;
}

function initialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved in DICTS) return saved;
  } catch {
    // storage blocked: fall through to browser language
  }
  return (navigator.language || 'en').toLowerCase().startsWith('de') ? 'de' : 'en';
}

let lang = typeof navigator === 'undefined' ? 'en' : initialLang();
const listeners = [];

export const getLang = () => lang;
export const t = (key) => makeT(DICTS, lang)(key);

/** Fill a template like "Thought for {s} s" with values. */
export function tf(key, values) {
  return t(key).replace(/\{(\w+)\}/g, (_, name) => values[name] ?? '');
}

/** Set a translatable label that follows language switches (optionally with {vars}). */
export function label(el, key, vars) {
  el.dataset.i18n = key;
  if (vars) el.dataset.i18nVars = JSON.stringify(vars);
  else delete el.dataset.i18nVars;
  el.textContent = vars ? tf(key, vars) : t(key);
}

export function onLangChange(fn) {
  listeners.push(fn);
}

/**
 * Static copy comes only from our own dictionaries, so data-i18n-html may use
 * innerHTML for simple inline markup. Model output never goes through here.
 */
export function applyStatic(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = el.dataset.i18nVars ? tf(el.dataset.i18n, JSON.parse(el.dataset.i18nVars)) : t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
}

function swapPrompts(oldLang, root = document) {
  const oldT = makeT(DICTS, oldLang);
  root.querySelectorAll('[data-i18n-prompt]').forEach((el) => {
    if (shouldReplacePrompt(el.value, oldT(el.dataset.i18nPrompt))) {
      el.value = t(el.dataset.i18nPrompt);
    }
  });
}

export function fillPrompts(root = document) {
  root.querySelectorAll('[data-i18n-prompt]').forEach((el) => {
    el.value = t(el.dataset.i18nPrompt);
  });
}

export function setLang(next) {
  if (!(next in DICTS)) return;
  const old = lang;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // not persisted; fine
  }
  document.documentElement.lang = next;
  applyStatic();
  swapPrompts(old);
  listeners.forEach((fn) => fn(next));
}
