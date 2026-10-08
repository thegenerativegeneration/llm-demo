import { label } from './i18n.js';
import * as engine from './engine.js';
import { runExclusive, describeRunError } from './state.js';
import { el, promptField, temperatureSlider, runControls } from './ui.js';

/** Shows the user's text plainly and the model's continuation highlighted. */
function continuationView(container, given) {
  container.replaceChildren();
  const pre = el('pre', 'answer continuation');
  const givenSpan = el('span', 'given');
  givenSpan.textContent = given;
  const gen = el('mark', 'gen pulse');
  pre.append(givenSpan, gen);
  const status = el('p', 'status', { role: 'status' });
  container.append(pre, status);
  return {
    update: (text) => (gen.textContent = text),
    finish({ finishReason, tokens, error }) {
      gen.classList.remove('pulse');
      if (error) {
        const { key, vars } = describeRunError(error);
        label(status, key, vars);
      }
      else if (finishReason === 'abort') label(status, 'out.stopped');
      else label(status, 'out.tokens', { n: tokens });
    },
  };
}

async function continueInto(out, { prompt, temperature, maxTokens }, showGiven = true) {
  const view = continuationView(out, showGiven ? prompt : '');
  try {
    const result = await engine.streamCompletion({ prompt, temperature, maxTokens }, view.update);
    view.finish(result);
    return result;
  } catch (error) {
    view.finish({ error });
    return null;
  }
}

/** Slide 1: type a beginning, the model continues it. */
export function mountContinue(mount) {
  const box = el('div', 'box');
  const prompt = promptField('box.prompt', 'cont.start', 2);
  const { controls, run, stopBtn, hint } = runControls('cont.run');
  const out = el('div', 'output');
  box.append(prompt.wrap, controls, out);
  mount.append(box);
  run.addEventListener('click', () =>
    runExclusive(() => continueInto(out, { prompt: prompt.area.value, temperature: 0.7, maxTokens: 60 }), stopBtn, hint),
  );
}

/** Slide 3: the same beginning, three draws, adjustable temperature. */
export function mountRandomness(mount) {
  const box = el('div', 'box');
  const prompt = promptField('box.prompt', 'rand.prompt', 2);
  const temp = temperatureSlider(0.7);
  const { controls, run, stopBtn, hint } = runControls('rand.run');
  const cards = el('div', 'cards');
  box.append(prompt.wrap, temp.wrap, controls, cards);
  mount.append(box);

  run.addEventListener('click', () =>
    runExclusive(
      async (run) => {
        const slots = [0, 1, 2].map(() => el('div', 'card'));
        cards.replaceChildren(...slots);
        for (const slot of slots) {
          const result = await continueInto(
            slot,
            { prompt: prompt.area.value, temperature: Number(temp.input.value), maxTokens: 12 },
            false,
          );
          if (!result || run.stopped) break;
        }
      },
      stopBtn,
      hint,
    ),
  );
}
