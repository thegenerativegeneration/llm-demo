import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickModelId, detectGpu } from '../js/models.js';

test('f16 variant when supported', () => {
  assert.equal(pickModelId('small', true), 'Qwen3-0.6B-q4f16_1-MLC');
  assert.equal(pickModelId('better', true), 'Qwen3-1.7B-q4f16_1-MLC');
});
test('f32 variant without shader-f16', () => {
  assert.equal(pickModelId('small', false), 'Qwen3-0.6B-q4f32_1-MLC');
});
test('no navigator.gpu', async () => {
  assert.deepEqual(await detectGpu({}), { ok: false, hasF16: false, reason: 'no-webgpu' });
});
test('adapter null', async () => {
  assert.deepEqual(await detectGpu({ gpu: { requestAdapter: async () => null } }), { ok: false, hasF16: false, reason: 'no-adapter' });
});
test('requestAdapter throws', async () => {
  assert.deepEqual(await detectGpu({ gpu: { requestAdapter: async () => { throw new Error('x'); } } }), { ok: false, hasF16: false, reason: 'no-adapter' });
});
test('adapter with f16', async () => {
  const nav = { gpu: { requestAdapter: async () => ({ features: new Set(['shader-f16']) }) } };
  assert.deepEqual(await detectGpu(nav), { ok: true, hasF16: true });
});
