"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
const ERRORS = {
  general: 'wamp.errors.invalid_argument',
  goodbye: 'wamp.error.goodbye_and_out',
  hello: 'wamp.error.no_such_realm',
  procedure: 'wamp.error.no_such_procedure',
  register: 'wamp.error.procedure_already_exists',
  unregister: 'wamp.error.no_such_registration',
  uri: 'wamp.error.invalid_uri',
};
exports.default = ERRORS;