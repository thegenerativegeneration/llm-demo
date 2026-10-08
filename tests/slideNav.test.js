import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slideFromHash, clamp } from '../js/slideNav.js';

test('hash number', () => assert.equal(slideFromHash('#3', 12), 3));
test('empty hash → 0', () => assert.equal(slideFromHash('', 12), 0));
test('garbage → 0', () => assert.equal(slideFromHash('#abc', 12), 0));
test('out of range → 0', () => assert.equal(slideFromHash('#12', 12), 0));
test('negative → 0', () => assert.equal(slideFromHash('#-1', 12), 0));
test('clamp', () => {
  assert.equal(clamp(-1, 5), 0);
  assert.equal(clamp(7, 5), 4);
  assert.equal(clamp(2, 5), 2);
});
