'use strict';
let autobahn = require('autobahn');
let connection = new autobahn.Connection({
  url: 'ws://127.0.0.1:8000/',
  realm: 'com.example.inge'
});

connection.onopen = function (session) {

  session.register('com.myapp.thefuck', () => {})

  session.call('com.myapp.thefuck', [])
    .catch(e => {
      console.log('e', e);
    });

};

connection.onclose = function(e) {
  console.error(e)
}

connection.open();
