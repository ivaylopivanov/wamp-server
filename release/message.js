"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *
 *
 * @export
 * @class Message
 */
class Message {
  /**
   * Creates an instance of Message.
   *
   * @param {string} incomingMessage
   */
  constructor(incomingMessage) {
    this.serialize(incomingMessage);
  }
  /**
   *
   *
   * @returns {SocketMessageInterface}
   */
  getMessage() {
    return this.message;
  }
  /**
   *
   *
   * @private
   * @param {string} incomingMessage
   */
  serialize(incomingMessage) {
    this.message = {
      incoming: this.parseMessage(incomingMessage),
    };
    this.setMessageType(this.message);
    this.setMessageID(this.message);
  }
  /**
   *
   *
   * @private
   * @param {string} message
   * @returns {any[]}
   */
  parseMessage(message) {
    try {
      return JSON.parse(message);
    } catch (e) {
      return [];
    }
  }
  /**
   *
   *
   * @private
   * @param {SocketMessageInterface} message
   */
  setMessageType(message) {
    message.type = message.incoming[0];
  }
  /**
   *
   *
   * @private
   * @param {SocketMessageInterface} message
   */
  setMessageID(message) {
    message.id = message.incoming[1];
  }
}
exports.default = Message;