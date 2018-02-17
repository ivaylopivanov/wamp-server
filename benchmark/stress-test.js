'use strict';
let autobahn = require('autobahn');
let join = require('path').join;
let fork = require('child_process').fork
let config = {
  calls: 500, // number of clients
  running: 0,
  wamp: {
    url: 'ws://127.0.0.1:8000/',
    realm: 'com.example.inge'
  }
};
let cycle;

fork(join(__dirname, './server/index.js'));
fork(join(__dirname, './clients/one/index.js'));
fork(join(__dirname, './clients/two/index.js'));

setTimeout(() => {
  start();
}, 100);

function timer(name) {
  let start = new Date();
  return {
    stop: function () {
      let end = new Date();
      let time = end.getTime() - start.getTime();
      console.log('Timer:', name, 'finished in', time, 'ms');
    }
  }
}

function start() {
  cycle = timer('cycle');
  for (let index = 0; index < config.calls; index++) {
    config.running++;
    create(index);
  }
}

function leave() {
  if (!--config.running) {
    cycle.stop();
    start();
  }
}

function onevent(e) { }

function create(index) {
  let connection = new autobahn.Connection(config.wamp);

  connection.onopen = function (session) {

    if (index % 20 === 0) {
      session.call('com.myapp.addThree', [2, 3, 4])
        .then(r => console.assert(r === 9))
        .catch(e => console.log(e));
      } else {
        session.call('com.myapp.addTwo', [2, 3])
        .then(r => console.assert(r === 5))
        .catch(e => console.log(e));
    }

    if (index % 2 === 0) {
      let st1 = timer(index)
      session.subscribe('com.myapp.event', onevent)
        .then(r => {
          let args = [['Hello, world!'], { from: 'pubsub' }, { acknowledge: true }];
          session.publish('com.myapp.event', ...args)
            .then(r => {
              connection.close();
              st1.stop();
              leave();
            })
        })
        .catch(e => {
          connection.close();
          st1.stop();
          leave();
        });
    } else {
      let st2 = timer(index)
      let args = [['Hello, world!'], { from: 'pub' }, { acknowledge: true }]
      session.publish('com.myapp.event', ...args)
        .then(r => {
          connection.close();
          st2.stop();
          leave();
        })
        .catch(e => {
          connection.close();
          st2.stop();
          leave();
        });
    }
  };
  connection.open();
}
