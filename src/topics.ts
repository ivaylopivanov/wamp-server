import * as Debug from 'debug';
import {
  SessionInterface,
  TopicInterface,
} from './interfaces';

const DEBUG = Debug('wamp:topics');
const topics = {};

/**
 *
 *
 * @class Topics
 */
class Topics {

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @returns {TopicInterface}
   */
  public static get(realm: string, topic: string): TopicInterface {
    return topics[realm][topic];
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   */
  public static registerRealm(realm: string): void {
    topics[realm] = {};
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @param {number} subscriptionID
   * @param {SessionInterface} session
   */
  public static subscribe(realm: string,
                          topic: string,
                          subscriptionID: number,
                          session: SessionInterface): void {
    DEBUG('subscribing with id: %s, realm: %s, topic: %s, sessionID: %s',
                                                              subscriptionID,
                                                              realm,
                                                              topic,
                                                              session.getID());
    if (!topics[realm][topic]) {
      const TOPIC: TopicInterface = {
        sessions: [],
        subscriptionID,
      };
      topics[realm][topic] = TOPIC;
    }
    topics[realm][topic].sessions.push(session);
  }

  /**
   *
   *
   * @static
   * @param {string} realm
   * @param {string} topic
   * @param {number} sessionID
   */
  public static unsubscribe(realm: string,
                            topic: string,
                            sessionID: number): void {
    DEBUG('unsubscribing sessionID: %s for topic: %s', sessionID, topic);
    const SESSIONS = topics[realm][topic].sessions;
    const LENGTH = SESSIONS.length;
    for (let i = 0; i < LENGTH; i++) {
      if (SESSIONS[i].getID() === sessionID) {
        SESSIONS.splice(i, 1);
        break;
      }
    }
  }

}

export default Topics;
