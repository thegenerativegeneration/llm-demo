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
  const nav = { gpu: { requestAdapter: async () => ({ features: new Set(['shader-f16']), limits: limits() }) } };
  assert.deepEqual(await detectGpu(nav), { ok: true, hasF16: true });
});

const limits = (over = {}) => ({
  maxStorageBuffersPerShaderStage: 10,
  maxComputeWorkgroupStorageSize: 32768,
  maxBufferSize: 1 << 30,
  maxStorageBufferBindingSize: 1 << 30,
  ...over,
});
const navWith = (l, f16 = true) => ({
  gpu: { requestAdapter: async () => ({ features: new Set(f16 ? ['shader-f16'] : []), limits: l }) },
});

test('too few storage buffers (Firefox) → limits', async () => {
  assert.deepEqual(await detectGpu(navWith(limits({ maxStorageBuffersPerShaderStage: 9 }))), { ok: false, hasF16: false, reason: 'limits' });
});
test('too little workgroup storage → limits', async () => {
  assert.deepEqual(await detectGpu(navWith(limits({ maxComputeWorkgroupStorageSize: 16384 }))), { ok: false, hasF16: false, reason: 'limits' });
});
test('small but sufficient buffers are fine (WebLLM falls back to 256/128 MB)', async () => {
  assert.deepEqual(
    await detectGpu(navWith(limits({ maxBufferSize: 1 << 28, maxStorageBufferBindingSize: 1 << 27 }))),
    { ok: true, hasF16: true },
  );
});
test('buffers below WebLLM fallback → limits', async () => {
  assert.deepEqual(await detectGpu(navWith(limits({ maxBufferSize: 1 << 27 }))), { ok: false, hasF16: false, reason: 'limits' });
});
