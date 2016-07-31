import { SocketInterface } from '../../src/interfaces';
import { EventEmitter } from 'events';

class Socket extends EventEmitter implements SocketInterface {

  public upgradeReq = {
    connection: {
      remoteAddress: ''
    }
  };
  public id = 0;
  public readyState = 0;

  constructor() {
    super();
  }

  public close() {}
  public send() {}
}

export default Socket;
