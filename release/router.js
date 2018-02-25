"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const Debug = require("debug");
const handlers_1 = require("./handlers");
const protocols_1 = require("./protocols");
const DEBUG = Debug('wamp:router');
/**
 *
 *
 * @export
 * @class Router
 */
class Router {
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {string}
   */
  static dispatch(session, message) {
    DEBUG('switching: %s, %s', message.type, protocols_1.incomingChannel[message.type]);
    if (!session.getRealm() && message.type !== protocols_1.outgoingChannel.HELLO) {
      handlers_1.default.abort(session);
      return protocols_1.incomingChannel[3];
    }
    switch (message.type) {
      case protocols_1.outgoingChannel.CALL:
        handlers_1.default.call(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.ERROR:
        handlers_1.default.error(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.GOODBYE:
        handlers_1.default.goodbye(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.HELLO:
        handlers_1.default.hello(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.PUBLISH:
        handlers_1.default.publish(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.REGISTER:
        handlers_1.default.register(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.SUBSCRIBE:
        handlers_1.default.subscribe(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.UNREGISTER:
        handlers_1.default.unregister(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.UNSUBSCRIBE:
        handlers_1.default.unsubscribe(session, message);
        return protocols_1.incomingChannel[message.type];
      case protocols_1.outgoingChannel.YIELD:
        handlers_1.default.yield(session, message);
        return protocols_1.incomingChannel[message.type];
      default:
        handlers_1.default.goodbye(session, message);
        return protocols_1.incomingChannel[6];
    }
  }
}
exports.default = Router;