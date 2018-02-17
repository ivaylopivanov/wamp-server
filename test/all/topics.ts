import {
  SessionInterface,
  TopicInterface,
} from '../../src/interfaces';
import Session from '../../src/session';
import Topics from '../../src/topics';
import Request from '../mocks/request';
import Socket from '../mocks/socket';
import { expect } from 'chai';

describe('Topics', () => {

  it('Should register realm', () => {
    let realm = 'com.some.thing';
    expect(Topics.registerRealm(realm)).to.be.undefined;
  });

  it('Should subscribe for topic', () => {
    const REALM = 'com.some.thing';
    const TOPIC = 'my.event';
    const SUB_ID = 123456789012345;
    const IP = new Request().connection.remoteAddress;

    const SESSION: SessionInterface = new Session(new Socket(), IP);
    const EXPECTED = Topics.subscribe(REALM, TOPIC, SUB_ID, SESSION);

    expect(EXPECTED).to.be.undefined;
  });

  it('Should get subscription', () => {
    let realm = 'com.some.thing';
    let topic = 'my.event';

    let subscription: TopicInterface = Topics.get(realm, topic);

    expect(subscription).to.has.property('subscriptionID');
    expect(subscription).to.has.property('sessions');
    expect(subscription.sessions).to.be.a('array');
    expect(subscription.sessions).to.has.lengthOf(1);
  });

  it('Should not fail if try to unsubscribe not existing session', () => {
    let realm = 'com.some.thing';
    let topic = 'my.event';

    expect(Topics.unsubscribe(realm, topic, undefined)).to.be.undefined;
  });

  it('Should unsubscribe', () => {
    let realm = 'com.some.thing';
    let topic = 'my.event';

    let subscriptionBefore: TopicInterface = Topics.get(realm, topic);
    let session: SessionInterface = subscriptionBefore.sessions[0];
    expect(Topics.unsubscribe(realm, topic, session.getID())).to.be.undefined;

    let subscriptionAfter: TopicInterface = Topics.get(realm, topic);
    expect(subscriptionAfter).to.has.property('subscriptionID');
    expect(subscriptionAfter).to.has.property('sessions');
    expect(subscriptionAfter.sessions).to.be.a('array');
    expect(subscriptionAfter.sessions).to.has.lengthOf(0);
  });

});
