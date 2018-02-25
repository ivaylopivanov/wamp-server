"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const Debug = require("debug");
const DEBUG = Debug('wamp:topics');
const topics = {};
/**
 *
 *
 * @class Topics
 */
class Topics {
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @returns {TopicInterface}
   */
  static get(realm, topic) {
    return topics[realm][topic];
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   */
  static registerRealm(realm) {
    topics[realm] = {};
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @param {number} subscriptionID
   * @param {SessionInterface} session
   */
  static subscribe(realm, topic, subscriptionID, session) {
    DEBUG('subscribing with id: %s, realm: %s, topic: %s, sessionID: %s', subscriptionID, realm, topic, session.getID());
    if (!topics[realm][topic]) {
      const TOPIC = {
        sessions: [],
        subscriptionID,
      };
      topics[realm][topic] = TOPIC;
    }
    topics[realm][topic].sessions.push(session);
  }
  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @param {number} sessionID
   */
  static unsubscribe(realm, topic, sessionID) {
    DEBUG('unsubscribing sessionID: %s for topic: %s', sessionID, topic);
    const SESSIONS = topics[realm][topic].sessions;
    const LENGTH = SESSIONS.length;
    for (let i = 0; i < LENGTH; i++) {
      if (SESSIONS[i].getID() === sessionID) {
        SESSIONS.splice(i, 1);
        break;
      }
    }
  }
}
exports.default = Topics;