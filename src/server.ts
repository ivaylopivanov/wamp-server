import { OptionsInterface } from './interfaces';
import SessionManager from './session-manager';
import * as Debug from 'debug';
import { Server as WsServer } from 'ws';

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
   * @type {string}
   */
  private host: string;

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
    this.host = options.host
    this.port = options.port;
    this.wss = new WsServer({ host: this.host, port: this.port });
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
    DEBUG('listening on port %s (host: %s)', this.port, this.host);
    this.wss.on('connection', SessionManager.createSession);
  }

}

export default Server;
