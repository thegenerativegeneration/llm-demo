/** Split text on **bold** markers. Unmatched markers stay literal. */
export function parseBold(text) {
  const parts = [];
  const re = /\*\*([^*]+?)\*\*/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) parts.push({ text: text.slice(last, m.index), bold: false });
    parts.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), bold: false });
  return parts;
}
