# How a language model writes / Wie ein Sprachmodell schreibt

A bilingual (DE/EN) slide lesson for non-technical people (designers, illustrators) that
shows what prompting and "thinking" are, using a small language model that runs entirely
in the browser. Nothing typed on the page leaves the computer.

Live: https://philipphaslbauer.com/llm-demo/

## Slides

Each slide adds one control, ending in a full playground:

0. Load the model
1. Type a few words: the model continues the text
2. Next word: the five most likely next tokens with probabilities
3. Randomness: temperature, three draws
4. Ask a question: chat instead of plain continuation
5. Be specific: vague vs. specific prompt
6. Chat: follow-ups and "forget everything" (the whole conversation is re-sent each turn)
7. Role: system prompt
8. Show examples: few-shot prompting
9. Thinking: the same question answered directly and after thinking
10. Where it goes wrong: playground with every control and prepared failure tests

Slides have URLs (`#0` … `#11`), and ← → switch slides.

## Requirements

- A browser with WebGPU: current Chrome or Edge on a laptop or desktop works best.
- Download on first use: Qwen3 0.6B ≈ 0.5 GB, Qwen3 1.7B ≈ 1.2 GB. The browser caches the
  model afterwards. The 1.7B model writes much better German.
- GPUs without `shader-f16` automatically get the f32 build, which needs more memory.

## Run locally

No build step:

```bash
python3 -m http.server 8765
# open http://localhost:8765/
```

Tests for the pure logic (Node 20+):

```bash
npm test
```

## Structure

- `index.html`, `style.css`: slides and styling (system fonts only, so no third-party requests besides the model download)
- `js/engine.js`: WebLLM wrapper (`@mlc-ai/web-llm@0.2.85` from jsDelivr, loaded on demand)
- `js/chatBox.js`, `js/completion.js`, `js/tokens.js`, `js/reasoning.js`: the exercises
- `js/text-en.js`, `js/text-de.js`: all copy and example prompts
- `js/thinking.js`, `js/markdown.js`, `js/chatHistory.js`, `js/tokenFormat.js`, `js/slideNav.js`, `js/models.js`: pure helpers with tests in `tests/`

## Credits

Runs [WebLLM](https://github.com/mlc-ai/web-llm) (Apache 2.0) with
[Qwen3](https://huggingface.co/Qwen) models (Apache 2.0). By Philipp Haslbauer.
