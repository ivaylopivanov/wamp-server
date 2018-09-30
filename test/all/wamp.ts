import { Connection } from 'autobahn';
import { expect } from 'chai';
import Server from '../../src/server';

let server: Server;
const finished: any = {
  ack: false,
  event: false,
  invocation: false,
  unregistered: false,
  unsubscribed: false,
  yield: false,
};

describe('wamp', function() {

  this.timeout(3000);

  beforeEach(() => {
    server = new Server({
      port: 8000,
      realms: 'com.test.autobahn',
    });
  });

  afterEach(() => server.close());

  // tslint:disable-next-line:max-line-length
  it('Should create two clients, make RPC and pub / sub', (done: () => void) => {

    createClient((clientOne: any, closeClientOne: () => void) => {
      let subscription: any;
      let registration: any;

      const onevent = (args: any) => {
        finished.event = true;
        clientOne.unsubscribe(subscription)
          .then(() => {
            finished.unsubscribed = true;
          });
      };

      const add = (args: any) => {
        setTimeout(() => {
          clientOne.unregister(registration)
            .then(() => {
              finished.unregistered = true;
              closeClientOne();
            });
        }, 1);
        finished.invocation = true;
        return args[0] + args[1];
      };

      clientOne.subscribe('com.test.event', onevent)
        .then((res: any) => {
          subscription = res;
        });

      clientOne.register('com.test.add', add)
        .then((res: any) => {
          registration = res;
        });

      createClient((clientTwo: any, closeClientTwo: () => void) => {

        clientTwo.call('com.test.add', [2, 3])
          .then((res: any) => {
            expect(res).equal(5);
            finished.yield = true;
            onFinish(done, closeClientTwo);
          });

        clientTwo.publish('com.test.event', ['Hello!'], {}, {acknowledge: true})
          .then(() => {
            finished.ack = true;
            onFinish(done, closeClientTwo);
          });

      });

    });

  });

});

// tslint:disable-next-line:max-line-length
const createClient = (callback: (session: any, closeSession: () => void) => void) => {
  const connection = new Connection({
    realm: 'com.test.autobahn',
    url: 'ws://127.0.0.1:8000/',
  });
  connection.onopen = (session: any) => {
    callback(session, () => connection.close());
  };
  connection.open();
};

const onFinish = (done: () => void, close: () => void) => {
  if (finished.ack &&
    finished.event &&
    finished.invocation &&
    finished.yield &&
    finished.unregistered &&
    finished.unsubscribed) {
    close();
    done();
  }
};
