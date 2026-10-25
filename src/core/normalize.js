// Rules are written against normalized text: lowercase, no accents,
// straight apostrophes and single spaces.
export function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[‘’`´]/g, "'")
    .replace(/\s+/g, ' ');
}
