import { SessionInterface } from '../../src/interfaces';
import Session from '../../src/session';
import SessionManager from '../../src/session-manager';
import Topics from '../../src/topics';
import Request from '../mocks/request';
import Socket from '../mocks/socket';
import { expect } from 'chai';

let request = new Request();
let socket = new Socket();
const IP = request.connection.remoteAddress;
socket.readyState = 1;
let session: SessionInterface = new Session(socket, IP);
let subscriptionID = 123456789;
let realm = 'com.some.session';

describe('Session', () => {

  it('Should set a realm', () => {
    SessionManager.registerRealms([realm]);
    expect(session.setRealm(realm)).to.be.undefined;
  });

  it('Should get a realm', () => {
    expect(session.getRealm()).equal('com.some.session');
  });

  it('Should get an id', () => {
    expect(session.getID()).to.be.a('number');
  });

  it('Should get an ip', () => {
    expect(session.getIP()).equal(IP);
  });

  it('Should push procedures.ts', () => {
    let procedure1 = 'com.some.session';
    let procedure2 = 'com.some.session';
    expect(session.pushProcedure(procedure1)).to.be.undefined;
    expect(session.pushProcedure(procedure2)).to.be.undefined;
  });

  it('Should not fail if you try to remove non existing procedure', () => {
    let procedure = 'com.some.not-existing';
    expect(session.removeProcedure(procedure)).to.be.undefined;
  });

  it('Should remove procedure', () => {
    let procedure = 'com.some.session';
    expect(session.removeProcedure(procedure)).to.be.undefined;
  });

  it('Should remove procedures', () => {
    expect(session.removeProcedures()).to.be.undefined;
  });

  it('Should push subscription', () => {
    let subscription = 'com.some.event';
    Topics.subscribe(realm, subscription, subscriptionID, session);
    let expected = session.pushSubscription(subscriptionID, subscription);
    expect(expected).to.be.undefined;
  });

  it('Should get subscription ID', () => {
    let subscription = 'com.some.event';
    expect(session.getSubscriptionID(subscription)).equal(subscriptionID);
  });

  it('Should remove subscription', () => {
    expect(session.removeSubsubscription(subscriptionID)).to.be.a('object');
  });

  it('Should not fail if try to get subscription ID of non existing', () => {
    let subscription = 'com.some.non-existing';
    expect(session.getSubscriptionID(subscription)).to.be.undefined;
  });

  it('Should remove subscriptions', () => {
    let subscription = 'com.some.event';
    Topics.subscribe(realm, subscription, subscriptionID, session);
    session.pushSubscription(subscriptionID, subscription);
    expect(session.removeSubscriptions()).to.be.undefined;
  });

  it('Should close the session', () => {
    expect(session.close()).to.be.undefined;
  });

  it('Should send a message', () => {
    let message: any[] = [
      1,
      2,
      {},
      []
    ];
    expect(session.send(message)).to.be.undefined;
  });

  it('Should handle incoming message', () => {
    let message: any[] = [
      1,
      2,
      {},
      []
    ];
    socket.emit('message', JSON.stringify(message));
  });

  it('Should handle closing of the socket', () => {
    let message: any[] = [
      1,
      2,
      {},
      []
    ];
    socket.emit('close', JSON.stringify(message));
  });

});
