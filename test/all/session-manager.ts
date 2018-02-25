import { expect } from 'chai';
import Session from '../../src/session';
import SessionManager from '../../src/session-manager';
import Request from '../mocks/request';
import Socket from '../mocks/socket';

let id: number;

describe('SessionManager', () => {

  it('Should register a realms', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.registerRealms([realm])).to.be.a('undefined');
  });

  it('Should fail register a realm', () => {
    const realm = 'wamp.com.realm';
    expect(() => {
      expect(SessionManager.registerRealms([realm]));
    }).to.throw('wamp.error.invalid_uri: "wamp.com.realm"');
  });

  it('Should return true that realm is registered', () => {
    const realm = 'com.some.realm';
    // tslint:disable-next-line:no-unused-expression
    expect(SessionManager.realmExists(realm)).to.be.true;
  });

  it('Should return false that realm is registered', () => {
    const realm = 'wamp.com.realm';
    // tslint:disable-next-line:no-unused-expression
    expect(SessionManager.realmExists(realm)).to.be.false;
  });

  it('Should return undefined for non existing session', () => {
    const realm = 'com.some.realm';
    const ID = 0;
    expect(SessionManager.getSession(realm, ID)).to.be.a('undefined');
  });

  it('Should return 0 for the amount of registered sessions', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.getSessionsAmount(realm)).equal(0);
  });

  it('Should create a session', () => {
    const RESULT = SessionManager.createSession(new Socket(), new Request());
    expect(RESULT).to.be.a('undefined');
  });

  it('Should register a session', () => {
    const REALM = 'com.some.realm';
    const IP = new Request().connection.remoteAddress;
    const SESSION = new Session(new Socket(), IP);
    id = SESSION.getID();
    expect(SessionManager.registerSession(REALM, SESSION)).to.be.a('undefined');
  });

  it('Should return 1 for the amount of registered sessions', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.getSessionsAmount(realm)).equal(1);
  });

  it('Should session by ID', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.getSession(realm, id)).to.be.instanceOf(Session);
  });

  it('Should not fail to remove non existing session', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.removeSession(realm, 0)).to.be.a('undefined');
    expect(SessionManager.getSessionsAmount(realm)).equal(1);
  });

  it('Should remove session', () => {
    const realm = 'com.some.realm';
    expect(SessionManager.removeSession(realm, id)).to.be.a('undefined');
    expect(SessionManager.getSessionsAmount(realm)).equal(0);
  });

});
