import { expect } from 'chai';
import { SocketMessageInterface } from '../../src/interfaces';
import Message from '../../src/message';

describe('Message', () => {

  it('Should get parsed message', () => {
    const ar: any[] = [
      1,
      'com.some.realm',
      {},
    ];
    const msg: string = JSON.stringify(ar);
    const message: SocketMessageInterface = new Message(msg).getMessage();

    expect(message).to.be.a('object');
    expect(message).to.has.property('type');
    expect(message).to.has.property('id');
    expect(message).to.has.property('incoming');
    expect(message.incoming).to.be.a('array');
  });

  it('Should not fail if the Message is init. with an empty string', () => {
    const message: SocketMessageInterface = new Message('').getMessage();

    expect(message).to.be.a('object');
    expect(message).to.has.property('type');
    expect(message).to.has.property('id');
    expect(message).to.has.property('incoming');
    expect(message.incoming).to.be.a('array');
  });

});
