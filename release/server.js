"use strict";
const session_manager_1 = require('./session-manager');
const Debug = require('debug');
const ws_1 = require('ws');
const DEBUG = Debug('wamp:server');
/**
 *
 *
 * @class Server
 */
class Server {
  /**
   * Creates an instance of Server.
   *
   * @param {OptionsInterface} options
   */
  constructor(options) {
    this.options = options;
    const REALMS = options.realms;
    this.host = options.host;
    this.port = options.port;
    this.wss = new ws_1.Server({
      host: this.host,
      port: this.port
    });
    session_manager_1.default.registerRealms(Array.isArray(REALMS) ? REALMS : [REALMS]);
    this.listen();
  }
  /**
   *
   */
  close() {
    this.wss.close();
  }
  /**
   *
   *
   * @private
   */
  listen() {
    DEBUG('listening on port %s (host: %s)', this.port, this.host);
    this.wss.on('connection', session_manager_1.default.createSession);
  }
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Server;