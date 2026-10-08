import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeT, shouldReplacePrompt } from '../js/i18n.js';

const dicts = { en: { a: 'A', b: 'B' }, de: { a: 'Ä' } };
test('lookup current lang', () => assert.equal(makeT(dicts, 'de')('a'), 'Ä'));
test('fallback to en', () => assert.equal(makeT(dicts, 'de')('b'), 'B'));
test('fallback to key', () => assert.equal(makeT(dicts, 'de')('zzz'), 'zzz'));
test('unedited prompt is replaced', () => assert.equal(shouldReplacePrompt('Write a slogan.', 'Write a slogan.'), true));
test('edited prompt is kept', () => assert.equal(shouldReplacePrompt('my own text', 'Write a slogan.'), false));
test('emptied prompt is refilled', () => assert.equal(shouldReplacePrompt('', 'Write a slogan.'), true));

test('en and de dictionaries have the same keys', async () => {
  const en = (await import('../js/text-en.js')).default;
  const de = (await import('../js/text-de.js')).default;
  assert.deepEqual(Object.keys(de).sort(), Object.keys(en).sort());
});
