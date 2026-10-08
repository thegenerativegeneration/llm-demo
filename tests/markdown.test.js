import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseBold } from '../js/markdown.js';

test('plain text', () => assert.deepEqual(parseBold('hi'), [{ text: 'hi', bold: false }]));
test('one bold part', () =>
  assert.deepEqual(parseBold('a **b** c'), [
    { text: 'a ', bold: false },
    { text: 'b', bold: true },
    { text: ' c', bold: false },
  ]));
test('two bold parts', () =>
  assert.deepEqual(parseBold('**x** and **y**'), [
    { text: 'x', bold: true },
    { text: ' and ', bold: false },
    { text: 'y', bold: true },
  ]));
test('unclosed marker stays literal', () => assert.deepEqual(parseBold('a **b'), [{ text: 'a **b', bold: false }]));
test('empty string', () => assert.deepEqual(parseBold(''), []));
