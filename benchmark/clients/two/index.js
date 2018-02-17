'use strict';
let autobahn = require('autobahn');
let connection = new autobahn.Connection({
  url: 'ws://127.0.0.1:8000/',
  realm: 'com.example.inge'
});

connection.onopen = function (session) {

  function addTwo(args) {
    return args[0] + args[1];
  }

  session.register('com.myapp.addTwo', addTwo)

};

connection.onclose = function(e) {
  console.error(e)
}

connection.open();
