import { slideFromHash, clamp } from './slideNav.js';
import { onLangChange, tf } from './i18n.js';
import { stopActiveRun } from './state.js';

const TYPING = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function initSlides() {
  const slides = [...document.querySelectorAll('.slide')];
  const count = slides.length;
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsEl = document.getElementById('dots');
  const counter = document.getElementById('counter');
  let current = -1;

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dot';
    b.addEventListener('click', () => go(i));
    dotsEl.append(b);
    return b;
  });
  const labelDots = () => dots.forEach((b, i) => b.setAttribute('aria-label', tf('nav.slide', { n: i })));
  labelDots();
  onLangChange(labelDots);

  function show(n, focus) {
    if (n === current) return;
    if (current !== -1) stopActiveRun();
    current = n;
    slides.forEach((s, i) => (s.hidden = i !== n));
    dots.forEach((b, i) => b.setAttribute('aria-current', i === n ? 'step' : 'false'));
    counter.textContent = `${n} / ${count - 1}`;
    prev.disabled = n === 0;
    next.disabled = n === count - 1;
    window.scrollTo(0, 0);
    if (focus) slides[n].querySelector('[tabindex="-1"]')?.focus({ preventScroll: true });
  }

  function go(n) {
    const target = clamp(n, count);
    if (location.hash !== `#${target}`) location.hash = `#${target}`;
    else show(target, true);
  }

  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  window.addEventListener('hashchange', () => show(slideFromHash(location.hash, count), true));
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || TYPING.has(document.activeElement?.tagName)) return;
    if (e.key === 'ArrowRight') go(current + 1);
    else if (e.key === 'ArrowLeft') go(current - 1);
  });

  show(slideFromHash(location.hash, count), false);
}
