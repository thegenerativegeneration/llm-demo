import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRunLock } from '../js/runLock.js';

test('second acquire fails while busy', () => {
  const lock = createRunLock();
  assert.equal(lock.acquire(), true);
  assert.equal(lock.acquire(), false);
  assert.equal(lock.busy(), true);
});
test('release frees the lock', () => {
  const lock = createRunLock();
  lock.acquire();
  lock.release();
  assert.equal(lock.busy(), false);
  assert.equal(lock.acquire(), true);
});
test('subscribers see busy changes', () => {
  const lock = createRunLock();
  const seen = [];
  lock.subscribe((b) => seen.push(b));
  lock.acquire();
  lock.acquire();
  lock.release();
  assert.deepEqual(seen, [true, false]);
});
