/* eslint-disable implicit-arrow-linebreak */
/**
 * Returns names's initials
 */
export default (name = '') =>
  name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');
