import Server from '../../src/server';
import { expect } from 'chai';

describe('Server', () => {

  it('Should create a server for a single realm', () => {
    let server = new Server({
      port: 7896,
      realms: 'com.some.server',
    });
    expect(server).to.be.instanceOf(Server);
    server.close();
  });

  it('Should create a server for a multiple realms', () => {
    let server = new Server({
      port: 7897,
      realms: ['com.some.server1', 'com.some.server2'],
    });
    expect(server).to.be.instanceOf(Server);
    server.close();
  });

});
