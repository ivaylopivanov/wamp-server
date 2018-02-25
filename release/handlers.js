"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const errors_1 = require("./errors");
const procedures_1 = require("./procedures");
const protocols_1 = require("./protocols");
const roles_1 = require("./roles");
const session_manager_1 = require("./session-manager");
const topics_1 = require("./topics");
const transactions_1 = require("./transactions");
const util_1 = require("./util");
const Debug = require("debug");
const DEBUG = Debug('wamp:handlers');
/**
 *
 *
 * @class Handlers
 */
class Handlers {
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   */
  static abort(session) {
    session.send([
      protocols_1.outgoingChannel.ABORT,
      errors_1.default.hello,
      roles_1.default,
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {void}
   */
  static call(session, message) {
    const URI = message.incoming[3];
    const REALM = session.getRealm();
    const PROCEDURE = procedures_1.default.get(REALM, URI);
    if (!PROCEDURE) {
      const ERROR = {
        errorMessage: errors_1.default.procedure,
        errorNumber: protocols_1.outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: protocols_1.outgoingChannel.CALL,
      };
      return session.error(message, ERROR);
    }
    let CALLEE;
    CALLEE = session_manager_1.default.getSession(session.getRealm(), PROCEDURE.sessionID);
    message.incoming[3] = PROCEDURE.procedureID;
    transactions_1.default.add(message.id, session.getID());
    Handlers.invocation(CALLEE, message);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static error(session, message) {
    const KEY = message.incoming[2];
    const SESSION_ID = transactions_1.default.get(KEY);
    const REALM = session.getRealm();
    transactions_1.default.delete(KEY);
    let SESSION;
    SESSION = session_manager_1.default.getSession(REALM, SESSION_ID);
    if (SESSION) {
      const ERROR = {
        args: message.incoming[5],
        errorMessage: message.incoming[4],
        errorNumber: protocols_1.outgoingChannel.ERROR,
        messageID: KEY,
        requestTypeNumber: protocols_1.outgoingChannel.CALL,
      };
      return SESSION.error(message, ERROR);
    }
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static goodbye(session, message) {
    session.send([
      protocols_1.outgoingChannel.GOODBYE,
      {},
      errors_1.default.goodbye,
    ]);
    session.close();
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {void}
   */
  static hello(session, message) {
    const REALM = String(message.id);
    if (session_manager_1.default.realmExists(REALM)) {
      session.setRealm(REALM);
      session_manager_1.default.registerSession(REALM, session);
      Handlers.welcome(session);
      return;
    }
    Handlers.abort(session);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static invocation(session, message) {
    const DETAILS = message.incoming[2];
    const PROCEDURE_ID = message.incoming[3];
    const ARGS = message.incoming[4];
    const KWARGS = message.incoming[5];
    const RESPONSE = [
      protocols_1.outgoingChannel.INVOCATION,
      message.id,
      PROCEDURE_ID,
      DETAILS,
      ARGS,
      KWARGS,
    ];
    session.send(RESPONSE);
  }
  /**
   *
   *
   * @static
   * @param {NotifyEvent} event
   */
  static notify(event) {
    const INDEX = event.currentIndex;
    const SESSION = event.subscription.sessions[INDEX];
    if (SESSION && INDEX < event.length) {
      if (SESSION.getID() !== event.session.getID()) {
        DEBUG('notifying sessionID: %s', SESSION.getID());
        const DETAILS = {
          topic: event.message.incoming[3]
        };
        const ARGS = event.message.incoming[4];
        const KWARGS = event.message.incoming[5];
        SESSION.send([
          protocols_1.outgoingChannel.EVENT,
          SESSION.getSubscriptionID(event.topic),
          event.subscription.subscriptionID,
          DETAILS,
          ARGS,
          KWARGS,
        ]);
      }
      event.currentIndex++;
      setImmediate(Handlers.notify, event);
    } else {
      Handlers.published(event.session, event.message);
    }
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static publish(session, message) {
    const TOPIC = message.incoming[3];
    const SUBSCRIPTION = topics_1.default.get(session.getRealm(), TOPIC);
    if (SUBSCRIPTION) {
      const LENGTH = SUBSCRIPTION.sessions.length;
      const EVENT = {
        currentIndex: 0,
        length: LENGTH,
        message,
        session,
        subscription: SUBSCRIPTION,
        topic: TOPIC,
      };
      Handlers.notify(EVENT);
    }
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static published(session, message) {
    if (message.incoming[2] && message.incoming[2].acknowledge) {
      session.send([
        protocols_1.outgoingChannel.PUBLISHED,
        message.id,
        util_1.makeID(),
      ]);
    }
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {void}
   */
  static register(session, message) {
    const PROCEDURE = message.incoming[3];
    const REALM = session.getRealm();
    if (!procedures_1.default.canAdd(REALM, PROCEDURE)) {
      const ERROR = {
        errorMessage: errors_1.default.register,
        errorNumber: protocols_1.outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: protocols_1.outgoingChannel.REGISTER,
      };
      return session.error(message, ERROR);
    }
    const PROCEDURE_ID = util_1.makeID();
    session.pushProcedure(PROCEDURE);
    procedures_1.default.add(REALM, PROCEDURE, session.getID(), PROCEDURE_ID);
    Handlers.registered(session, message, PROCEDURE_ID);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @param {number} procedureID
   */
  static registered(session, message, procedureID) {
    session.send([
      protocols_1.outgoingChannel.REGISTERED,
      message.id,
      procedureID,
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static result(session, message) {
    session.send([
      protocols_1.outgoingChannel.RESULT,
      message.id,
      {},
      message.incoming[3],
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {void}
   */
  static subscribe(session, message) {
    const TOPIC = message.incoming[3];
    if (!TOPIC) {
      const ERROR = {
        errorMessage: errors_1.default.general,
        errorNumber: protocols_1.outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: protocols_1.outgoingChannel.SUBSCRIBE,
      };
      return session.error(message, ERROR);
    }
    const SUBSCRIPTION_ID = util_1.makeID();
    message.incoming[3] = SUBSCRIPTION_ID;
    session.pushSubscription(SUBSCRIPTION_ID, TOPIC);
    topics_1.default.subscribe(session.getRealm(), TOPIC, SUBSCRIPTION_ID, session);
    Handlers.subscribed(session, message);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static subscribed(session, message) {
    session.send([
      protocols_1.outgoingChannel.SUBSCRIBED,
      message.id,
      message.incoming[3],
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   * @returns {void}
   */
  static unregister(session, message) {
    const REALM = session.getRealm();
    const ID = message.incoming[2];
    const PROCEDURE = procedures_1.default.getByID(REALM, ID);
    if (PROCEDURE && PROCEDURE.uri) {
      session.removeProcedure(PROCEDURE.uri);
      procedures_1.default.remove(REALM, PROCEDURE.uri);
      return Handlers.unregistered(session, message);
    }
    const ERROR = {
      errorMessage: errors_1.default.unregister,
      errorNumber: protocols_1.outgoingChannel.ERROR,
      messageID: message.id,
      requestTypeNumber: protocols_1.outgoingChannel.UNREGISTER,
    };
    session.error(message, ERROR);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static unregistered(session, message) {
    session.send([
      protocols_1.outgoingChannel.UNREGISTERED,
      message.id,
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static unsubscribe(session, message) {
    const SUBSCRIPTION_ID = message.incoming[2];
    const SUBSCRIPTION = session
      .removeSubsubscription(SUBSCRIPTION_ID);
    if (SUBSCRIPTION && SUBSCRIPTION.topic) {
      topics_1.default.unsubscribe(session.getRealm(), SUBSCRIPTION.topic, session.getID());
      Handlers.unsubscribed(session, message);
    }
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static unsubscribed(session, message) {
    session.send([
      protocols_1.outgoingChannel.UNSUBSCRIBED,
      message.id,
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   */
  static welcome(session) {
    session.send([
      protocols_1.outgoingChannel.WELCOME,
      session.getID(),
      roles_1.default,
    ]);
  }
  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  static yield(session, message) {
    const KEY = message.id;
    const SESSION_ID = transactions_1.default.get(KEY);
    const REALM = session.getRealm();
    transactions_1.default.delete(KEY);
    let SESSION;
    SESSION = session_manager_1.default.getSession(REALM, SESSION_ID);
    if (SESSION) {
      Handlers.result(SESSION, message);
    }
  }
}
exports.default = Handlers;