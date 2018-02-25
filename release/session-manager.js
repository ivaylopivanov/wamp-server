"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const Debug = require("debug");
const errors_1 = require("./errors");
const procedures_1 = require("./procedures");
const session_1 = require("./session");
const topics_1 = require("./topics");
const util_1 = require("./util");
const DEBUG = Debug('wamp:session-manager');
const containers = new Map();
/**
 *
 *
 * @class SessionManager
 */
class SessionManager {
  /**
   *
   *
   * @static
   * @param {string} realm
   * @returns {boolean}
   */
  static realmExists(realm) {
    return containers.get(realm) ? true : false;
  }
  /**
   *
   *
   * @static
   * @param {SocketInterface} socket
   */
  static createSession(socket, req) {
    const IP = req.connection.remoteAddress;
    const SESSION = new session_1.default(socket, IP);
    DEBUG('creating session for ip: %s with id: %s', SESSION.getIP(), SESSION.getID());
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {number} id
   * @returns {SessionInterface}
   */
  static getSession(realm, id) {
    DEBUG('getting session for id: %s', id);
    const SESSIONS = containers.get(realm);
    if (SESSIONS) {
      return SESSIONS.get(id);
    }
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {SessionInterface} session
   */
  static registerSession(realm, session) {
    DEBUG('registering session with id: %s for realm: %s', session.getID(), realm);
    containers.get(realm).set(session.getID(), session);
    DEBUG('number of sessions: %s', SessionManager.getSessionsAmount(realm));
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {number} id
   */
  static removeSession(realm, id) {
    DEBUG('removing session: %s for realm: %s', id, realm);
    containers.get(realm).delete(id);
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @returns {number}
   */
  static getSessionsAmount(realm) {
    return containers.get(realm).size;
  }
  /**
   *
   *
   * @static
   * @param {string[]} realms
   */
  static registerRealms(realms) {
    realms.forEach((realm) => {
      DEBUG(`registering realm: ${realm}`);
      if (util_1.isValidRealm(realm)) {
        containers.set(realm, new Map());
        procedures_1.default.registerRealm(realm);
        topics_1.default.registerRealm(realm);
      } else {
        throw new Error(`${errors_1.default.uri}: "${realm}"`);
      }
    });
  }
}
exports.default = SessionManager;