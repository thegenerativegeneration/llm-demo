import { label } from './i18n.js';
import { runExclusive } from './state.js';
import { el, promptField, runControls, streamInto } from './ui.js';

/** Slide 9: the same question answered directly and after thinking, side by side. */
export function mountReasoning(mount) {
  const box = el('div', 'box');
  const prompt = promptField('box.prompt', 'reason.q', 3);
  const { controls, run, stopBtn, hint } = runControls('reason.run');
  const columns = el('div', 'columns');
  const outs = ['reason.direct', 'reason.think'].map((key) => {
    const col = el('div');
    const h = el('h3');
    label(h, key);
    const out = el('div', 'output');
    col.append(h, out);
    columns.append(col);
    return out;
  });
  box.append(prompt.wrap, controls, columns);
  mount.append(box);

  run.addEventListener('click', () =>
    runExclusive(
      async (run) => {
        outs.forEach((o) => o.replaceChildren());
        const messages = [{ role: 'user', content: prompt.area.value }];
        const direct = await streamInto(outs[0], { messages, thinking: false });
        if (!direct || run.stopped) return;
        await streamInto(outs[1], { messages, thinking: true });
      },
      stopBtn,
      hint,
    ),
  );
}
