import * as Debug from 'debug';
import {
  MapInterface,
} from './interfaces';

const DEBUG = Debug('wamp:transactions');
const transactions: MapInterface = new Map();

/**
 *
 *
 * @class Transaction
 */
class Transaction {

  /**
   *
   *
   * @static
   * @param {number} id
   * @param {number} sessionID
   */
  public static add(id: number, sessionID: number): void {
    DEBUG('setting transaction with ID: %s for sessionID: %s', id, sessionID);
    transactions.set(id, sessionID);
  }

  /**
   *
   *
   * @static
   * @param {number} id
   * @returns {number}
   */
  public static get(id: number): number {
    DEBUG('getting transaction with ID: %s', id);
    return transactions.get(id);
  }

  /**
   *
   *
   * @static
   * @param {number} id
   */
  public static delete(id: number): void {
    DEBUG('deleting transaction with ID: %s', id);
    transactions.delete(id);
  }

}

export default Transaction;
