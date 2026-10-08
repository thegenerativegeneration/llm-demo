import { test } from 'node:test';
import assert from 'node:assert/strict';
import { displayToken, toPercent } from '../js/tokenFormat.js';

test('leading space shown', () => assert.equal(displayToken(' cat'), '␣cat'));
test('newline shown', () => assert.equal(displayToken('\n'), '↵'));
test('empty shown as replacement char', () => assert.equal(displayToken(''), '�'));
test('plain token unchanged', () => assert.equal(displayToken('ing'), 'ing'));
test('percent rounding', () => assert.equal(toPercent(0.372), '37 %'));
test('tiny percent', () => assert.equal(toPercent(0.004), '<1 %'));

import { isBrokenToken } from '../js/tokenFormat.js';
test('replacement char is broken', () => assert.equal(isBrokenToken('a�'), true));
test('empty token is broken', () => assert.equal(isBrokenToken(''), true));
test('normal token is fine', () => assert.equal(isBrokenToken(' Haus'), false));
test('all spaces and tabs are made visible', () => assert.equal(displayToken('  a\tb'), '␣␣a⇥b'));
