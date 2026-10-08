import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMessages } from '../js/chatHistory.js';

test('input only', () =>
  assert.deepEqual(buildMessages({ input: 'hi' }), [{ role: 'user', content: 'hi' }]));
test('blank system prompt is left out', () =>
  assert.deepEqual(buildMessages({ system: '  ', input: 'hi' }), [{ role: 'user', content: 'hi' }]));
test('system + history + input in order', () =>
  assert.deepEqual(
    buildMessages({
      system: ' Be brief. ',
      history: [{ role: 'user', content: 'a' }, { role: 'assistant', content: 'b' }],
      input: 'c',
    }),
    [
      { role: 'system', content: 'Be brief.' },
      { role: 'user', content: 'a' },
      { role: 'assistant', content: 'b' },
      { role: 'user', content: 'c' },
    ],
  ));
