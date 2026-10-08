import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitThinking } from '../js/thinking.js';

test('no think tags → all answer', () => {
  assert.deepEqual(splitThinking('Hello'), { thoughts: '', answer: 'Hello', thinkingOpen: false });
});
test('closed block', () => {
  assert.deepEqual(splitThinking('<think>\nhmm\n</think>\n\nHi'), { thoughts: 'hmm', answer: 'Hi', thinkingOpen: false });
});
test('empty block from enable_thinking:false', () => {
  assert.deepEqual(splitThinking('<think>\n\n</think>\n\nHi'), { thoughts: '', answer: 'Hi', thinkingOpen: false });
});
test('unclosed block (streaming or cap hit)', () => {
  assert.deepEqual(splitThinking('<think>let me see'), { thoughts: 'let me see', answer: '', thinkingOpen: true });
});
test('partial opening tag while streaming is hidden', () => {
  assert.deepEqual(splitThinking('<thi'), { thoughts: '', answer: '', thinkingOpen: true });
});
test('empty string', () => {
  assert.deepEqual(splitThinking(''), { thoughts: '', answer: '', thinkingOpen: false });
});
