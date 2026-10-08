import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyError } from '../js/errors.js';

const err = (name, message = '') => Object.assign(new Error(message), { name });

test('device lost → lost', () => assert.equal(classifyError(err('DeviceLostError')), 'lost'));
test('model not loaded → lost', () => assert.equal(classifyError(err('ModelNotLoadedError')), 'lost'));
test('device lost by message', () => assert.equal(classifyError(new Error('GPU device was lost')), 'lost'));
test('context window → context', () => assert.equal(classifyError(err('ContextWindowSizeExceededError')), 'context'));
test('anything else → other', () => assert.equal(classifyError(new Error('boom')), 'other'));
