import Server from '../../src/server';
import { Connection } from 'autobahn';
import { expect } from 'chai';

let server: Server;
let finished: any = {
  ack: false,
  event: false,
  invocation: false,
  unregistered: false,
  unsubscribed: false,
  yield: false,
};

describe('wamp', function() {

  this.timeout(500);

  beforeEach(() => {
    server = new Server({
      port: 8000,
      realms: 'com.test.autobahn',
    });
  });

  afterEach(() => server.close());

  it('Should create two clients, make RPC and pub / sub', (done: Function) => {

    createClient((clientOne: any) => {
      let subscription: any;
      let registration: any;

      let onevent = (args: any) => {
        finished.event = true;
        clientOne.unsubscribe(subscription)
          .then(() => {
            finished.unsubscribed = true;
            onFinish(done);
          });
      };

      let add = (args: any) => {
        setTimeout(() => {
          clientOne.unregister(registration)
            .then(() => {
              finished.unregistered = true;
              onFinish(done);
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


      createClient((clientTwo: any) => {

        clientTwo.call('com.test.add', [2, 3])
          .then((res: any) => {
            expect(res).equal(5);
            finished.yield = true;
            onFinish(done);
          });

        clientTwo.publish('com.test.event', ['Hello!'], {}, {acknowledge: true})
          .then(() => {
            finished.ack = true;
            onFinish(done);
          });

      });

    });

  });

});

let createClient = (callback: Function) => {
  let connection = new Connection({
    realm: 'com.test.autobahn',
    url: 'ws://127.0.0.1:8000/',
  });
  connection.onopen = (session: any) => {
    callback(session);
  };
  connection.open();
};

let onFinish = (done: Function) => {
  if (finished.ack &&
    finished.event &&
    finished.invocation &&
    finished.yield &&
    finished.unregistered &&
    finished.unsubscribed) {
    done();
  }
};
