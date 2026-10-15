/**
 * textkit — a tiny, dependency-free text utility library.
 *
 * Public API:
 *   slugify(text)            -> URL-friendly slug
 *   truncate(text, max, ...) -> shortened string with a suffix
 *   capitalize(text)         -> first character upper-cased
 */

/**
 * Convert an arbitrary string into a URL-friendly slug.
 *
 * Spec: the result is lower-case; every run of non-alphanumeric characters
 * becomes a single hyphen; leading/trailing hyphens are removed; and inputs
 * with no alphanumeric characters produce an empty string.
 *
 * @param {unknown} text
 * @returns {string}
 */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Shorten `text` so that it is at most `maxLength` characters long, appending
 * `suffix` when truncation happens.
 *
 * @param {unknown} text
 * @param {number} maxLength
 * @param {string} [suffix]
 * @returns {string}
 */
export function truncate(text, maxLength, suffix = '…') {
  const value = String(text);
  const limit = Number(maxLength);

  if (!Number.isInteger(limit) || limit < 0) {
    throw new RangeError('maxLength must be a non-negative integer');
  }
  if (value.length <= limit) {
    return value;
  }
  if (limit <= suffix.length) {
    return value.slice(0, limit);
  }
  return value.slice(0, limit - suffix.length) + suffix;
}

/**
 * Upper-case the first character of `text`, leaving the rest untouched.
 *
 * @param {unknown} text
 * @returns {string}
 */
export function capitalize(text) {
  const value = String(text);
  if (value.length === 0) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}
