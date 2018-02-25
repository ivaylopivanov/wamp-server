import * as Debug from 'debug';
import { Server as WsServer } from 'ws';
import { OptionsInterface } from './interfaces';
import SessionManager from './session-manager';

const DEBUG = Debug('wamp:server');

/**
 *
 *
 * @class Server
 */
class Server {

  /**
   *
   *
   * @private
   * @type {number}
   */
  private port: number;
  /**
   *
   *
   * @private
   * @type {(any | WsServer)}
   */
  private wss: any | WsServer;

  /**
   * Creates an instance of Server.
   *
   * @param {OptionsInterface} options
   */
  constructor(private options: OptionsInterface) {
    const REALMS: string | string[] = options.realms;
    this.port = options.port;
    this.wss = new WsServer({ port: this.port });
    SessionManager.registerRealms(Array.isArray(REALMS) ? REALMS : [REALMS]);
    this.listen();
  }

  /**
   *
   */
  public close(): void {
    this.wss.close();
  }

  /**
   *
   *
   * @private
   */
  private listen(): void {
    DEBUG('listening on port %s', this.port);
    this.wss.on('connection', SessionManager.createSession);
  }

}

export default Server;
