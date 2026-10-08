export const clamp = (n, count) => Math.min(Math.max(n, 0), count - 1);

export function slideFromHash(hash, count) {
  const m = /^#(\d+)$/.exec(hash);
  if (!m) return 0;
  const n = Number(m[1]);
  return n < count ? n : 0;
}
