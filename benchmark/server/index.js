'use strict';
let join = require('path').join;
let server = require(join(__dirname, '..', '..'));
const SERVER = new server({
  port: 8000,
  realms: ['com.example.inge'],
});
console.log('Server is running on port: 8000');
