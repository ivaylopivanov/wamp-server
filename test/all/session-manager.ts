import Session from '../../src/session';
import SessionManager from '../../src/session-manager';
import Socket from '../mocks/socket';
import { expect } from 'chai';

let id: number;

describe('SessionManager', () => {

  it('Should register a realms', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.registerRealms([realm])).to.be.undefined;
  });

  it('Should fail register a realm', () => {
    let realm = 'wamp.com.realm';
    expect(() => {
      expect(SessionManager.registerRealms([realm]));
    }).to.throw('wamp.error.invalid_uri: "wamp.com.realm"');
  });

  it('Should return true that realm is registered', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.realmExists(realm)).to.be.true;
  });

  it('Should return false that realm is registered', () => {
    let realm = 'wamp.com.realm';
    expect(SessionManager.realmExists(realm)).to.be.false;
  });

  it('Should return undefined for non existing session', () => {
    let realm = 'com.some.realm';
    let id = 0;
    expect(SessionManager.getSession(realm, id)).to.be.undefined;
  });

  it('Should return 0 for the amount of registered sessions', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.getSessionsAmount(realm)).equal(0);
  });

  it('Should create a session', () => {
    expect(SessionManager.createSession(new Socket())).to.be.undefined;
  });

  it('Should register a session', () => {
    let realm = 'com.some.realm';
    let session = new Session(new Socket());
    id = session.getID();
    expect(SessionManager.registerSession(realm, session)).to.be.undefined;
  });

  it('Should return 1 for the amount of registered sessions', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.getSessionsAmount(realm)).equal(1);
  });

  it('Should session by ID', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.getSession(realm, id)).to.be.instanceOf(Session);
  });

  it('Should not fail to remove non existing session', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.removeSession(realm, 0)).to.be.undefined;
    expect(SessionManager.getSessionsAmount(realm)).equal(1);
  });

  it('Should remove session', () => {
    let realm = 'com.some.realm';
    expect(SessionManager.removeSession(realm, id)).to.be.undefined;
    expect(SessionManager.getSessionsAmount(realm)).equal(0);
  });

});
