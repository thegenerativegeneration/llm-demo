/** A token that is only part of a multi-byte character (e.g. half an umlaut). */
export const isBrokenToken = (token) => token === '' || token.includes('�');

/** Make invisible parts of a token visible: spaces, tabs, line breaks. */
export function displayToken(token) {
  if (isBrokenToken(token)) return '�';
  return token.replace(/ /g, '␣').replace(/\t/g, '⇥').replace(/\n/g, '↵');
}

export function toPercent(prob) {
  const pct = Math.round(prob * 100);
  return pct < 1 ? '<1 %' : `${pct} %`;
}
