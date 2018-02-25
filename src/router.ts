import * as Debug from 'debug';
import Handlers from './handlers';
import {
  SessionInterface,
  SocketMessageInterface,
} from './interfaces';
import { incomingChannel, outgoingChannel } from './protocols';

const DEBUG = Debug('wamp:router');

/**
 *
 *
 * @export
 * @class Router
 */
export default class Router {

  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {string}
   */
  public static dispatch(session: SessionInterface,
                         message: SocketMessageInterface): string {
    DEBUG('switching: %s, %s', message.type, incomingChannel[message.type]);
    if (!session.getRealm() && message.type !== outgoingChannel.HELLO) {
      Handlers.abort(session);
      return incomingChannel[3];
    }
    switch (message.type) {
    case outgoingChannel.CALL:
      Handlers.call(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.ERROR:
      Handlers.error(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.GOODBYE:
      Handlers.goodbye(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.HELLO:
      Handlers.hello(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.PUBLISH:
      Handlers.publish(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.REGISTER:
      Handlers.register(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.SUBSCRIBE:
      Handlers.subscribe(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.UNREGISTER:
      Handlers.unregister(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.UNSUBSCRIBE:
      Handlers.unsubscribe(session, message);
      return incomingChannel[message.type];
    case outgoingChannel.YIELD:
      Handlers.yield(session, message);
      return incomingChannel[message.type];
    default:
      Handlers.goodbye(session, message);
      return incomingChannel[6];
    }
  }

}
