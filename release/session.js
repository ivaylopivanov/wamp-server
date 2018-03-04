"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const Debug = require("debug");
const message_1 = require("./message");
const procedures_1 = require("./procedures");
const router_1 = require("./router");
const session_manager_1 = require("./session-manager");
const topics_1 = require("./topics");
const util_1 = require("./util");
const DEBUG = Debug('wamp:session');
/**
 *
 *
 * @class Session
 */
class Session {
  /**
   * Creates an instance of Session.
   *
   * @param {SocketInterface} socket
   */
  constructor(socket, ip) {
    this.socket = socket;
    this.ip = ip;
    /**
     *
     *
     * @private
     * @type {number}
     */
    this.id = util_1.makeID();
    /**
     *
     *
     * @private
     * @type {string[]}
     */
    this.procedures = [];
    /**
     *
     *
     * @private
     * @type {SubscriptionInterface[]}
     */
    this.subscriptions = [];
    this.addSocketEventListener();
  }
  /**
   *
   *
   * @param {string} realm
   */
  setRealm(realm) {
    this.realm = realm;
  }
  /**
   *
   *
   * @returns {string}
   */
  getRealm() {
    return this.realm;
  }
  /**
   *
   *
   * @returns {string}
   */
  getIP() {
    return this.ip;
  }
  /**
   *
   *
   * @returns {number}
   */
  getID() {
    return this.id;
  }
  /**
   *
   *
   * @param {string} uri
   */
  pushProcedure(uri) {
    this.procedures.push(uri);
  }
  /**
   *
   *
   * @param {string} uri
   */
  removeProcedure(uri) {
    const LENGTH = this.procedures.length;
    for (let i = 0; i < LENGTH; i++) {
      if (this.procedures[i] === uri) {
        DEBUG('removing procedure: %s', uri);
        this.procedures.splice(i, 1);
        break;
      }
    }
  }
  /**
   *
   */
  removeProcedures() {
    const LENGTH = this.procedures.length;
    for (let i = 0; i < LENGTH; i++) {
      procedures_1.default.remove(this.realm, this.procedures[i]);
    }
  }
  /**
   *
   *
   * @param {number} subscriptionID
   * @param {string} topic
   */
  pushSubscription(subscriptionID, topic) {
    this.subscriptions.push({
      subscriptionID,
      topic,
    });
  }
  /**
   *
   *
   * @param {number} subscriptionID
   * @returns {SubscriptionInterface}
   */
  removeSubsubscription(subscriptionID) {
    const LENGTH = this.subscriptions.length;
    for (let i = 0; i < LENGTH; i++) {
      if (this.subscriptions[i].subscriptionID === subscriptionID) {
        DEBUG('removing subscription: %s', subscriptionID);
        let subscription;
        subscription = this.subscriptions.splice(i, 1);
        return subscription[0];
      }
    }
  }
  /**
   *
   */
  removeSubscriptions() {
    const LENGTH = this.subscriptions.length;
    for (let i = 0; i < LENGTH; i++) {
      topics_1.default.unsubscribe(this.realm, this.subscriptions[i].topic, this.id);
    }
  }
  /**
   *
   *
   * @param {string} topic
   * @returns {number}
   */
  getSubscriptionID(topic) {
    const LENGTH = this.subscriptions.length;
    for (let i = 0; i < LENGTH; i++) {
      if (this.subscriptions[i].topic === topic) {
        return this.subscriptions[i].subscriptionID;
      }
    }
  }
  /**
   *
   *
   * @param {SocketMessageInterface} messae
   * @param {ErrorMessageInterface} error
   */
  error(messae, error) {
    const ERROR_MESSAGE = [
      error.errorNumber,
      error.requestTypeNumber,
      error.messageID,
      {},
      error.errorMessage,
      error.args,
    ];
    this.send(ERROR_MESSAGE);
  }
  /**
   *
   *
   * @param {any[]} message
   */
  send(message) {
    if (this.socket.readyState === 1) {
      const RESPONSE = JSON.stringify(message);
      DEBUG('outgoing message: %s', RESPONSE);
      this.socket.send(RESPONSE);
    }
  }
  /**
   *
   */
  close() {
    DEBUG('cleaning...');
    this.removeSubscriptions();
    this.removeProcedures();
    session_manager_1.default.removeSession(this.realm, this.id);
    this.socket.close();
  }
  /**
   *
   *
   * @private
   */
  addSocketEventListener() {
    this.socket.on('message', (incomingMessage) => {
      DEBUG('incoming message %s for sessionID: %s', incomingMessage, this.id);
      router_1.default.dispatch(this, new message_1.default(incomingMessage).getMessage());
    });
    this.socket.on('close', () => {
      DEBUG('closing session for ID: %s and IP: %s', this.id, this.ip);
      if (this.realm) {
        this.close();
      }
    });
    this.socket.on('error', (err) => {
      const MSG = err.message;
      DEBUG('socket error "%s" for ID: %s and IP: %s', MSG, this.id, this.ip);
      if (MSG.indexOf('ECONNRESET') > -1) {
        this.close();
      }
    });
  }
}
exports.default = Session;