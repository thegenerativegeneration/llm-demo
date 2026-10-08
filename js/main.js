import { applyStatic, fillPrompts, getLang, setLang, onLangChange, t } from './i18n.js';

function syncLangButtons(lang) {
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  document.title = t('meta.title');
}

document.querySelectorAll('[data-lang]').forEach((b) => {
  b.addEventListener('click', () => setLang(b.dataset.lang));
});
onLangChange(syncLangButtons);

document.documentElement.lang = getLang();
applyStatic();
fillPrompts();
syncLangButtons(getLang());
