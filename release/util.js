"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 *
 * @export
 * @returns {number}
 */
function makeID() {
  return Math.floor(Math.random() * 9007199254740992); // 2^53
}
exports.makeID = makeID;
/**
 *
 *
 * @export
 * @param {string} realm
 * @returns {boolean}
 */
function isValidRealm(realm) {
  const PATTERN = /^([^\s\.#]+\.)*([^\s\.#]+)$/;
  if (!realm || !PATTERN.test(realm) || realm.indexOf('wamp.') === 0) {
    return false;
  }
  return true;
}
exports.isValidRealm = isValidRealm;