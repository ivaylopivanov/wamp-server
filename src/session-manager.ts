import * as Debug from 'debug';
import errors from './errors';
import {
  MapInterface,
  SessionInterface,
  SocketInterface,
} from './interfaces';
import Procedures from './procedures';
import Session from './session';
import Topics from './topics';
import { isValidRealm } from './util';

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
  public static realmExists(realm: string): boolean {
    return containers.get(realm) ? true : false;
  }

  /**
   *
   *
   * @static
   * @param {SocketInterface} socket
   */
  public static createSession(socket: SocketInterface, req: any): void {
    const IP = req.connection.remoteAddress;
    const SESSION: SessionInterface = new Session(socket, IP);
    DEBUG('creating session for ip: %s with id: %s',
          SESSION.getIP(),
          SESSION.getID());
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {number} id
   * @returns {SessionInterface}
   */
  public static getSession(realm: string, id: number): SessionInterface {
    DEBUG('getting session for id: %s', id);
    const SESSIONS: MapInterface = containers.get(realm);
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
  public static registerSession(realm: string,
                                session: SessionInterface): void {
    DEBUG('registering session with id: %s for realm: %s',
          session.getID(),
          realm);
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
  public static removeSession(realm: string, id: number): void {
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
  public static getSessionsAmount(realm: string): number {
    return containers.get(realm).size;
  }

  /**
   *
   *
   * @static
   * @param {string[]} realms
   */
  public static registerRealms(realms: string[]): void {
    realms.forEach((realm) => {
      DEBUG(`registering realm: ${realm}`);
      if (isValidRealm(realm)) {
        containers.set(realm, new Map());
        Procedures.registerRealm(realm);
        Topics.registerRealm(realm);
      } else {
        throw new Error(`${errors.uri}: "${realm}"`);
      }
    });
  }

}

export default SessionManager;
