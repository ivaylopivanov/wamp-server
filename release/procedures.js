"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const Debug = require("debug");
const DEBUG = Debug('wamp:procedure');
const procedures = {};
class Procedures {
  /**
   *
   *
   * @static
   * @param {string} realm
   */
  static registerRealm(realm) {
    procedures[realm] = {};
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @param {number} sessionID
   * @param {number} procedureID
   */
  static add(realm, uri, sessionID, procedureID) {
    DEBUG('registering procedure %s', uri);
    DEBUG('procedure id: %s', procedureID);
    DEBUG('session id: %s', sessionID);
    const PROCEDURE = {
      procedureID,
      sessionID,
      uri,
    };
    procedures[realm][uri] = PROCEDURE;
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @returns {ProcedureInterface}
   */
  static get(realm, uri) {
    DEBUG('getting %s: ', uri);
    return procedures[realm][uri];
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {number} id
   * @returns {ProcedureInterface}
   */
  static getByID(realm, id) {
    const KEYS = Object.keys(procedures[realm]);
    const LENGTH = KEYS.length;
    for (let i = 0; i < LENGTH; i++) {
      const PROCEDURE = procedures[realm][KEYS[i]];
      if (PROCEDURE.procedureID === id) {
        DEBUG('getByID id: %s, uri: %s', PROCEDURE.procedureID, PROCEDURE.uri);
        return PROCEDURE;
      }
    }
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   */
  static remove(realm, uri) {
    DEBUG('removing %s: ', uri);
    procedures[realm][uri] = undefined;
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @returns {boolean}
   */
  static canAdd(realm, uri) {
    return Procedures.get(realm, uri) ? false : true;
  }
}
exports.default = Procedures;