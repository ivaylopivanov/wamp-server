import { SocketMessageInterface } from './interfaces';

/**
 *
 *
 * @export
 * @class Message
 */
export default class Message {

  /**
   *
   *
   * @private
   * @type {SocketMessageInterface}
   */
  private message: SocketMessageInterface;

  /**
   * Creates an instance of Message.
   *
   * @param {string} incomingMessage
   */
  constructor(incomingMessage: string) {
    this.serialize(incomingMessage);
  }

  /**
   *
   *
   * @returns {SocketMessageInterface}
   */
  public getMessage(): SocketMessageInterface {
    return this.message;
  }

  /**
   *
   *
   * @private
   * @param {string} incomingMessage
   */
  private serialize(incomingMessage: string) {
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
  private parseMessage(message: string): any[] {
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
  private setMessageType(message: SocketMessageInterface): void {
    message.type = message.incoming[0];
  }

  /**
   *
   *
   * @private
   * @param {SocketMessageInterface} message
   */
  private setMessageID(message: SocketMessageInterface): void {
    message.id = message.incoming[1];
  }

}
