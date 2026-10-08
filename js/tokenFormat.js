/** Make invisible parts of a token visible: leading space, line breaks, broken bytes. */
export function displayToken(token) {
  if (token === '' || token.includes('�')) return '�';
  return token.replace(/^ /, '␣').replace(/\n/g, '↵');
}

export function toPercent(prob) {
  const pct = Math.round(prob * 100);
  return pct < 1 ? '<1 %' : `${pct} %`;
}
