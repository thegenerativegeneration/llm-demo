import { applyStatic, fillPrompts, getLang, setLang, onLangChange, t } from './i18n.js';
import { mountLoader } from './loader.js';
import { mountChatBox } from './chatBox.js';
import { mountContinue, mountRandomness } from './completion.js';
import { mountTokens } from './tokens.js';
import { mountReasoning } from './reasoning.js';
import { initSlides } from './slides.js';

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

// each slide adds one control: see the spec's slide table
mountContinue(document.getElementById('continue-box'));
mountTokens(document.getElementById('tokens-box'));
mountRandomness(document.getElementById('rand-box'));
mountChatBox(box('ask'), { promptKey: 'ask.prompt', rows: 2 });
mountChatBox(box('vague'), { promptKey: 'p.vague', labelKey: 'prompt.vagueLabel', rows: 4 });
mountChatBox(box('specific'), { promptKey: 'p.specific', labelKey: 'prompt.specificLabel', rows: 4 });
mountChatBox(box('chat'), { promptKey: 'chat.prompt', rows: 2, history: true });
mountChatBox(box('role'), { promptKey: 'role.task', rows: 2, system: true });
mountChatBox(box('fewshot'), { promptKey: 'fewshot.prompt', rows: 11 });
mountReasoning(document.getElementById('reason-box'));
mountChatBox(box('playground'), {
  promptKey: null,
  rows: 2,
  system: true,
  history: true,
  temperature: true,
  think: true,
  tests: true,
});

initSlides();
mountLoader(document.getElementById('loader'));
