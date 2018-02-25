/**
 *
 *
 * @export
 * @returns {number}
 */
export function makeID(): number {
  return Math.floor(Math.random() * 9007199254740992); // 2^53
}

/**
 *
 *
 * @export
 * @param {string} realm
 * @returns {boolean}
 */
export function isValidRealm(realm: string): boolean {
  const PATTERN = /^([^\s\.#]+\.)*([^\s\.#]+)$/;
  if (!realm || !PATTERN.test(realm) || realm.indexOf('wamp.') === 0) {
    return false;
  }
  return true;
}
