'use strict';
let autobahn = require('autobahn');
let connection = new autobahn.Connection({
  url: 'ws://127.0.0.1:8000/',
  realm: 'com.example.inge'
});

connection.onopen = function (session) {

  function onevent(args) {}
  function addThree(args) {
    return args[0] + args[1] + args[2];
  }

  session.register('com.myapp.addThree', addThree)
  session.subscribe('com.myapp.event', onevent);

};

connection.onclose = function(e) {
  console.error(e)
}

connection.open();
