import errors from './errors';
import {
  ErrorMessageInterface,
  NotifyEvent,
  ProcedureInterface,
  SessionInterface,
  SocketMessageInterface,
  SubscriptionInterface,
  TopicInterface,
} from './interfaces';
import Procedures from './procedures';
import { outgoingChannel } from './protocols';
import roles from './roles';
import SessionManager from './session-manager';
import Topics from './topics';
import Transactions from './transactions';
import { makeID } from './util';

import * as Debug from 'debug';

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
  public static abort(session: SessionInterface): void {
    session.send([
      outgoingChannel.ABORT,
      errors.hello,
      roles,
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
  public static call(session: SessionInterface,
                     message: SocketMessageInterface): void {
    const URI: string = message.incoming[3];
    const REALM: string = session.getRealm();
    const PROCEDURE: ProcedureInterface = Procedures.get(REALM, URI);
    if (!PROCEDURE) {
      const ERROR: ErrorMessageInterface = {
        errorMessage: errors.procedure,
        errorNumber: outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: outgoingChannel.CALL,
      };
      return session.error(message, ERROR);
    }
    let CALLEE: SessionInterface;
    CALLEE = SessionManager.getSession(session.getRealm(), PROCEDURE.sessionID);
    message.incoming[3] = PROCEDURE.procedureID;
    Transactions.add(message.id, session.getID());
    Handlers.invocation(CALLEE, message);
  }

  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  public static error(session: SessionInterface,
                      message: SocketMessageInterface): void {
    const KEY: number = message.incoming[2];
    const SESSION_ID = Transactions.get(KEY);
    const REALM: string = session.getRealm();
    Transactions.delete(KEY);
    let SESSION: SessionInterface;
    SESSION = SessionManager.getSession(REALM, SESSION_ID);
    if (SESSION) {
      const ERROR: ErrorMessageInterface = {
        args: message.incoming[5],
        errorMessage:  message.incoming[4],
        errorNumber: outgoingChannel.ERROR,
        messageID: KEY,
        requestTypeNumber: outgoingChannel.CALL,
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
  public static goodbye(session: SessionInterface,
                        message: SocketMessageInterface): void {
    session.send([
      outgoingChannel.GOODBYE,
      {},
      errors.goodbye,
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
  public static hello(session: SessionInterface,
                      message: SocketMessageInterface): void {
    const REALM: string = String(message.id);
    if (SessionManager.realmExists(REALM)) {
      session.setRealm(REALM);
      SessionManager.registerSession(REALM, session);
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
  public static invocation(session: SessionInterface,
                           message: SocketMessageInterface): void {
    const DETAILS: {} = message.incoming[2];
    const PROCEDURE_ID: number = message.incoming[3];
    const ARGS: any[] = message.incoming[4];
    const KWARGS: {} = message.incoming[5];
    const RESPONSE: any[] = [
      outgoingChannel.INVOCATION,
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
  public static notify(event: NotifyEvent): void {
    const INDEX: number = event.currentIndex;
    const SESSION: SessionInterface = event.subscription.sessions[INDEX];
    if (SESSION && INDEX < event.length) {
      if (SESSION.getID() !== event.session.getID()) {
        DEBUG('notifying sessionID: %s', SESSION.getID());
        const DETAILS: {} = {topic: event.message.incoming[3]};
        const ARGS: any[] = event.message.incoming[4];
        const KWARGS: {} = event.message.incoming[5];
        SESSION.send([
          outgoingChannel.EVENT,
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
  public static publish(session: SessionInterface,
                        message: SocketMessageInterface): void {
    const TOPIC: string = message.incoming[3];
    const SUBSCRIPTION: TopicInterface = Topics.get(session.getRealm(), TOPIC);
    if (SUBSCRIPTION) {
      const LENGTH: number = SUBSCRIPTION.sessions.length;
      const EVENT: NotifyEvent = {
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
  public static published(session: SessionInterface,
                          message: SocketMessageInterface): void {
    if (message.incoming[2] && message.incoming[2].acknowledge) {
      session.send([
        outgoingChannel.PUBLISHED,
        message.id,
        makeID(),
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
  public static register(session: SessionInterface,
                         message: SocketMessageInterface): void {
    const PROCEDURE: string = message.incoming[3];
    const REALM: string = session.getRealm();
    if (!Procedures.canAdd(REALM, PROCEDURE)) {
      const ERROR: ErrorMessageInterface = {
        errorMessage:  errors.register,
        errorNumber: outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: outgoingChannel.REGISTER,
      };
      return session.error(message, ERROR);
    }
    const PROCEDURE_ID: number = makeID();
    session.pushProcedure(PROCEDURE);
    Procedures.add(REALM, PROCEDURE, session.getID(), PROCEDURE_ID);
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
  public static registered(session: SessionInterface,
                           message: SocketMessageInterface,
                           procedureID: number): void {
    session.send([
      outgoingChannel.REGISTERED,
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
  public static result(session: SessionInterface,
                       message: SocketMessageInterface): void {
    session.send([
      outgoingChannel.RESULT,
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
  public static subscribe(session: SessionInterface,
                          message: SocketMessageInterface): void {
    const TOPIC: string = message.incoming[3];
    if (!TOPIC) {
      const ERROR: ErrorMessageInterface = {
        errorMessage:  errors.general,
        errorNumber: outgoingChannel.ERROR,
        messageID: message.id,
        requestTypeNumber: outgoingChannel.SUBSCRIBE,
      };
      return session.error(message, ERROR);
    }
    const SUBSCRIPTION_ID: number = makeID();
    message.incoming[3] = SUBSCRIPTION_ID;
    session.pushSubscription(SUBSCRIPTION_ID,  TOPIC);
    Topics.subscribe(session.getRealm(), TOPIC, SUBSCRIPTION_ID, session);
    Handlers.subscribed(session, message);
  }

  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  public static subscribed(session: SessionInterface,
                           message: SocketMessageInterface): void {
    session.send([
      outgoingChannel.SUBSCRIBED,
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
  public static unregister(session: SessionInterface,
                           message: SocketMessageInterface): void {
    const REALM: string = session.getRealm();
    const ID: number = message.incoming[2];
    const PROCEDURE: ProcedureInterface = Procedures.getByID(REALM, ID);
    if (PROCEDURE && PROCEDURE.uri) {
      session.removeProcedure(PROCEDURE.uri);
      Procedures.remove(REALM, PROCEDURE.uri);
      return Handlers.unregistered(session, message);
    }
    const ERROR: ErrorMessageInterface = {
      errorMessage:  errors.unregister,
      errorNumber: outgoingChannel.ERROR,
      messageID: message.id,
      requestTypeNumber: outgoingChannel.UNREGISTER,
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
  public static unregistered(session: SessionInterface,
                             message: SocketMessageInterface): void {
    session.send([
      outgoingChannel.UNREGISTERED,
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
  public static unsubscribe(session: SessionInterface,
                            message: SocketMessageInterface): void {
    const SUBSCRIPTION_ID: number = message.incoming[2];
    const SUBSCRIPTION: SubscriptionInterface = session
      .removeSubsubscription(SUBSCRIPTION_ID);
    if (SUBSCRIPTION && SUBSCRIPTION.topic) {
      Topics.unsubscribe(session.getRealm(),
                         SUBSCRIPTION.topic,
                         session.getID());
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
  public static unsubscribed(session: SessionInterface,
                             message: SocketMessageInterface): void {
    session.send([
      outgoingChannel.UNSUBSCRIBED,
      message.id,
    ]);
  }

  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   */
  public static welcome(session: SessionInterface): void {
    session.send([
      outgoingChannel.WELCOME,
      session.getID(),
      roles,
    ]);
  }

  /**
   *
   *
   * @static
   * @param {SessionInterface} session
   * @param {SocketMessageInterface} message
   */
  public static yield(session: SessionInterface,
                      message: SocketMessageInterface): void {
    const KEY: number = message.id;
    const SESSION_ID = Transactions.get(KEY);
    const REALM: string = session.getRealm();
    Transactions.delete(KEY);
    let SESSION: SessionInterface;
    SESSION = SessionManager.getSession(REALM, SESSION_ID);
    if (SESSION) {
      Handlers.result(SESSION, message);
    }
  }

}

export default Handlers;
