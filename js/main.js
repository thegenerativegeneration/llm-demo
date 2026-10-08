import { applyStatic, fillPrompts, getLang, setLang, onLangChange, t } from './i18n.js';
import { mountLoader } from './loader.js';
import { mountTryBox } from './tryBox.js';

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

const box = (name) => document.querySelector(`[data-box="${name}"]`);

mountTryBox(box('vague'), { promptKey: 'p.vague', labelKey: 'prompt.vagueLabel', rows: 4 });
mountTryBox(box('specific'), { promptKey: 'p.specific', labelKey: 'prompt.specificLabel', rows: 4 });
mountTryBox(box('role'), { promptKey: 'role.task', withRole: true, rows: 2 });
['fail.count', 'fail.bio', 'fail.sources', 'fail.date'].forEach((key) => {
  mountTryBox(box(key), { promptKey: key, rows: 2 });
});

mountLoader(document.getElementById('loader'));
