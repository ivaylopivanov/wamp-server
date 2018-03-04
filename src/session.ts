import * as Debug from 'debug';
import {
  ErrorMessageInterface,
  SocketInterface,
  SocketMessageInterface,
  SubscriptionInterface,
} from './interfaces';
import Message from './message';
import Procedures from './procedures';
import Router from './router';
import SessionManager from './session-manager';
import Topics from './topics';
import { makeID } from './util';

const DEBUG = Debug('wamp:session');

/**
 *
 *
 * @class Session
 */
class Session {

  /**
   *
   *
   * @private
   * @type {number}
   */
  private id: number = makeID();
  /**
   *
   *
   * @private
   * @type {string[]}
   */
  private procedures: string[] = [];
  /**
   *
   *
   * @private
   * @type {string}
   */
  private realm: string;
  /**
   *
   *
   * @private
   * @type {SubscriptionInterface[]}
   */
  private subscriptions: SubscriptionInterface[] = [];

  /**
   * Creates an instance of Session.
   *
   * @param {SocketInterface} socket
   */
  constructor(private socket: SocketInterface, private ip: string) {
    this.addSocketEventListener();
  }

  /**
   *
   *
   * @param {string} realm
   */
  public setRealm(realm: string): void {
    this.realm = realm;
  }

  /**
   *
   *
   * @returns {string}
   */
  public getRealm(): string {
    return this.realm;
  }

  /**
   *
   *
   * @returns {string}
   */
  public getIP(): string {
    return this.ip;
  }

  /**
   *
   *
   * @returns {number}
   */
  public getID(): number {
    return this.id;
  }

  /**
   *
   *
   * @param {string} uri
   */
  public pushProcedure(uri: string): void {
    this.procedures.push(uri);
  }

  /**
   *
   *
   * @param {string} uri
   */
  public removeProcedure(uri: string): void {
    const LENGTH: number = this.procedures.length;
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
  public removeProcedures(): void {
    const LENGTH: number = this.procedures.length;
    for (let i = 0; i < LENGTH; i++) {
      Procedures.remove(this.realm, this.procedures[i]);
    }
  }

  /**
   *
   *
   * @param {number} subscriptionID
   * @param {string} topic
   */
  public pushSubscription(subscriptionID: number, topic: string): void {
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
  public removeSubsubscription(subscriptionID: number): SubscriptionInterface {
    const LENGTH: number = this.subscriptions.length;
    for (let i = 0; i < LENGTH; i++) {
      if (this.subscriptions[i].subscriptionID === subscriptionID) {
        DEBUG('removing subscription: %s', subscriptionID);
        let subscription: SubscriptionInterface[];
        subscription = this.subscriptions.splice(i, 1);
        return subscription[0];
      }
    }
  }

  /**
   *
   */
  public removeSubscriptions(): void {
    const LENGTH: number = this.subscriptions.length;
    for (let i = 0; i < LENGTH; i++) {
      Topics.unsubscribe(this.realm, this.subscriptions[i].topic, this.id);
    }
  }

  /**
   *
   *
   * @param {string} topic
   * @returns {number}
   */
  public getSubscriptionID(topic: string): number {
    const LENGTH: number = this.subscriptions.length;
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
  public error(messae: SocketMessageInterface,
               error: ErrorMessageInterface): void {
    const ERROR_MESSAGE: any[] = [
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
  public send(message: any[]): void {
    if (this.socket.readyState === 1) {
      const RESPONSE: string = JSON.stringify(message);
      DEBUG('outgoing message: %s', RESPONSE);
      this.socket.send(RESPONSE);
    }
  }

  /**
   *
   */
  public close(): void {
    DEBUG('cleaning...');
    this.removeSubscriptions();
    this.removeProcedures();
    SessionManager.removeSession(this.realm, this.id);
    this.socket.close();
  }

  /**
   *
   *
   * @private
   */
  private addSocketEventListener(): void {
    this.socket.on('message', (incomingMessage: string) => {
      DEBUG('incoming message %s for sessionID: %s', incomingMessage, this.id);
      Router.dispatch(this, new Message(incomingMessage).getMessage());
    });
    this.socket.on('close', () => {
      DEBUG('closing session for ID: %s and IP: %s', this.id, this.ip);
      if (this.realm) {
        this.close();
      }
    });
    this.socket.on('error', (err: Error) => {
      const MSG: string = err.message;
      DEBUG('socket error "%s" for ID: %s and IP: %s', MSG, this.id, this.ip);
      if (MSG.indexOf('ECONNRESET') > -1) {
        this.close();
      }
    });
  }
}

export default Session;
