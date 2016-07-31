import { SessionInterface } from '../../src/interfaces';
import Message from '../../src/message';
import { incomingChannel } from '../../src/protocols';
import Router from '../../src/router';
import Session from '../../src/session';
import SessionManager from '../../src/session-manager';
import Socket from '../mocks/socket';
import { expect } from 'chai';

let realm = 'com.some.realm';
let session: SessionInterface;
let message = new Message(JSON.stringify([
  1,
  realm,
  {}
])).getMessage();

describe('Router', () => {

  beforeEach(() => {
    SessionManager.registerRealms([realm]);
    SessionManager.createSession(new Socket());
    session = new Session(new Socket());
    session.setRealm(realm);
  });

  it('Should switch to abort', () => {
    session.setRealm('');
    message.type = 48;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[3]);
  });

  it('Should switch to call', () => {
    message.type = 48;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to goodbye', () => {
    message.type = 6;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to goodbye', () => {
    message.type = 100;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[6]);
  });

  it('Should switch to hello', () => {
    message.type = 1;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to publish', () => {
    message.type = 16;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to register', () => {
    message.type = 64;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to subscribe', () => {
    message.type = 32;
    message.incoming[3] = 'my.event';
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to unregister', () => {
    message.type = 66;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to unsubscribe', () => {
    message.type = 34;
    message.incoming[3] = 'my.event';
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to yield', () => {
    message.type = 70;
    let type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

});
