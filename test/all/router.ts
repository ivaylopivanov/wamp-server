import { expect } from 'chai';
import { SessionInterface } from '../../src/interfaces';
import Message from '../../src/message';
import { incomingChannel } from '../../src/protocols';
import Router from '../../src/router';
import Session from '../../src/session';
import SessionManager from '../../src/session-manager';
import Request from '../mocks/request';
import Socket from '../mocks/socket';

const realm = 'com.some.realm';
let session: SessionInterface;
const message = new Message(JSON.stringify([
  1,
  realm,
  {},
])).getMessage();

describe('Router', () => {

  beforeEach(() => {
    SessionManager.registerRealms([realm]);
    SessionManager.createSession(new Socket(), new Request());
    session = new Session(new Socket(), new Request().connection.remoteAddress);
    session.setRealm(realm);
  });

  it('Should switch to abort', () => {
    session.setRealm('');
    message.type = 48;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[3]);
  });

  it('Should switch to call', () => {
    message.type = 48;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to goodbye', () => {
    message.type = 6;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to goodbye', () => {
    message.type = 100;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[6]);
  });

  it('Should switch to hello', () => {
    message.type = 1;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to publish', () => {
    message.type = 16;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to register', () => {
    message.type = 64;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to subscribe', () => {
    message.type = 32;
    message.incoming[3] = 'my.event';
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to unregister', () => {
    message.type = 66;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to unsubscribe', () => {
    message.type = 34;
    message.incoming[3] = 'my.event';
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

  it('Should switch to yield', () => {
    message.type = 70;
    const type = Router.dispatch(session, message);
    expect(type).equal(incomingChannel[message.type]);
  });

});
