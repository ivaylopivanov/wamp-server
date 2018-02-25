import { EventEmitter } from 'events';
import { SocketInterface } from '../../src/interfaces';

class Socket extends EventEmitter implements SocketInterface {

  public id = 0;
  public readyState = 0;

  constructor() {
    super();
  }

  public close() {
    // ...
  }
  public send() {
    // ...
  }

}

export default Socket;
