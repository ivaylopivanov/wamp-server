import * as Debug from 'debug';
import {
  ProcedureInterface,
} from './interfaces';

const DEBUG = Debug('wamp:procedure');
const procedures = {};

class Procedures {

  /**
   *
   *
   * @static
   * @param {string} realm
   */
  public static registerRealm(realm: string) {
    procedures[realm] = {};
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @param {number} sessionID
   * @param {number} procedureID
   */
  public static add(realm: string,
                    uri: string,
                    sessionID: number,
                    procedureID: number): void {
    DEBUG('registering procedure %s', uri);
    DEBUG('procedure id: %s', procedureID);
    DEBUG('session id: %s', sessionID);
    const PROCEDURE: ProcedureInterface = {
      procedureID,
      sessionID,
      uri,
    };
    procedures[realm][uri] = PROCEDURE;
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @returns {ProcedureInterface}
   */
  public static get(realm: string, uri: string): ProcedureInterface {
    DEBUG('getting %s: ', uri);
    return procedures[realm][uri];
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {number} id
   * @returns {ProcedureInterface}
   */
  public static getByID(realm: string, id: number): ProcedureInterface {
    const KEYS = Object.keys(procedures[realm]);
    const LENGTH = KEYS.length;
    for (let i = 0; i < LENGTH; i++) {
      const PROCEDURE: ProcedureInterface = procedures[realm][KEYS[i]];
      if (PROCEDURE.procedureID === id) {
        DEBUG('getByID id: %s, uri: %s', PROCEDURE.procedureID, PROCEDURE.uri);
        return PROCEDURE;
      }
    }
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   */
  public static remove(realm: string, uri: string): void {
    DEBUG('removing %s: ', uri);
    procedures[realm][uri] = undefined;
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} uri
   * @returns {boolean}
   */
  public static canAdd(realm: string, uri: string): boolean {
    return Procedures.get(realm, uri) ? false : true;
  }

}

export default Procedures;
