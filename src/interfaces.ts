import Session from './session';

/**
 *
 *
 * @export
 * @interface ErrorMessageInterface
 */
export interface ErrorMessageInterface {
  /**
   *
   *
   * @type {number}
   */
  errorNumber: number;
  /**
   *
   *
   * @type {string}
   */
  errorMessage: string;
  /**
   *
   *
   * @type {number}
   */
  messageID: number;
  /**
   *
   *
   * @type {number}
   */
  requestTypeNumber: number;
  /**
   *
   *
   * @type {any}
   */
  args?: any;
}

/**
 *
 *
 * @export
 * @interface EventEmitter
 */
export interface EventEmitter {
  /**
   *
   *
   * @param {string} event
   * @param {Function} listener
   * @returns {this}
   */
  addListener(event: string, listener: () => void): this;
  /**
   *
   *
   * @param {string} event
   * @param {Function} listener
   * @returns {this}
   */
  on(event: string, listener: (message: any) => void): this;
  /**
   *
   *
   * @param {string} event
   * @param {Function} listener
   * @returns {this}
   */
  once(event: string, listener: () => void): this;
  /**
   *
   *
   * @param {string} event
   * @param {Function} listener
   * @returns {this}
   */
  removeListener(event: string, listener: () => void): this;
  /**
   *
   *
   * @param {string} [event]
   * @returns {this}
   */
  removeAllListeners(event?: string): this;
  /**
   *
   *
   * @param {number} n
   * @returns {this}
   */
  setMaxListeners(n: number): this;
  /**
   *
   *
   * @returns {number}
   */
  getMaxListeners(): number;
  /**
   *
   *
   * @param {string} event
   * @returns {Function[]}
   */
  listeners(event: string): () => void[];
  /**
   *
   *
   * @param {string} event
   * @param {...any[]} args
   * @returns {boolean}
   */
  emit(event: string, ...args: any[]): boolean;
  /**
   *
   *
   * @param {string} type
   * @returns {number}
   */
  listenerCount(type: string): number;
}

/**
 *
 *
 * @export
 * @interface Events
 * @extends {EventEmitter}
 */
export interface Events extends EventEmitter { }

/**
 *
 *
 * @export
 * @interface MapInterface
 */
export interface MapInterface {
    /**
     *
     *
     * @type {number}
     */
    size: number;
    /**
     *
     *
     * @param {*} key
     * @returns {boolean}
     */
    delete(key: any): boolean;
    /**
     *
     *
     * @param {*} key
     * @returns {*}
     */
    get(key: any): any;
    /**
     *
     *
     * @param {*} key
     * @returns {boolean}
     */
    has(key: any): boolean;
    /**
     *
     *
     * @param {*} key
     * @param {*} value
     * @returns {MapInterface}
     */
    set(key: any, value: any): MapInterface;
}

/**
 *
 *
 * @export
 * @interface NotifyEvent
 */
export interface NotifyEvent {
  /**
   *
   *
   * @type {number}
   */
  currentIndex: number;
  /**
   *
   *
   * @type {number}
   */
  length: number;
  /**
   *
   *
   * @type {SocketMessageInterface}
   */
  message: SocketMessageInterface;
  /**
   *
   *
   * @type {TopicInterface}
   */
  subscription: TopicInterface;
  /**
   *
   *
   * @type {Session}
   */
  session: Session;
  /**
   *
   *
   * @type {string}
   */
  topic: string;
}

/**
 *
 *
 * @export
 * @interface OptionsInterface
 */
export interface OptionsInterface {
  /**
   *
   *
   * @type {number}
   */
  port: number;
  /**
   *
   *
   * @type {(string | string[])}
   */
  realms: string | string[];
}

/**
 *
 *
 * @export
 * @interface ProcedureInterface
 */
export interface ProcedureInterface {
  /**
   *
   *
   * @type {number}
   */
  procedureID: number;
  /**
   *
   *
   * @type {number}
   */
  sessionID: number;
  /**
   *
   *
   * @type {string}
   */
  uri: string;
}

/**
 *
 *
 * @export
 * @interface SocketInterface
 * @extends {EventEmitter}
 */
export interface SocketInterface extends EventEmitter {
  /**
   *
   *
   * @type {(number | string)}
   */
  id: number | string;
  /**
   *
   *
   * @type {string}
   */
  ip?: string;
  /**
   *
   *
   * @type {*}
   */
  connection?: any;
  /**
   *
   *
   * @type {number}
   */
  readyState: number;
  /**
   *
   *
   * @param {string} message
   */
  send(message: string): void;
  /**
   *
   */
  close(): void;
}

/**
 *
 *
 * @export
 * @interface SocketMessageInterface
 */
export interface SocketMessageInterface {
  /**
   *
   *
   * @type {number}
   */
  id?: number;
  /**
   *
   *
   * @type {number}
   */
  type?: number;
  /**
   *
   *
   * @type {any[]}
   */
  incoming?: any[];
  /**
   *
   *
   * @type {*}
   */
  details?: any;
  /**
   *
   *
   * @type {any[]}
   */
  args?: any[];
  /**
   *
   *
   * @type {{}}
   */
  kwargs?: {};
}

/**
 *
 *
 * @export
 * @interface SessionInterface
 * @extends {Session}
 */
export interface SessionInterface extends Session {}

/**
 *
 *
 * @export
 * @interface SubscriptionInterface
 */
export interface SubscriptionInterface {
  /**
   *
   *
   * @type {number}
   */
  subscriptionID: number;
  /**
   *
   *
   * @type {string}
   */
  topic: string;
}

/**
 *
 *
 * @export
 * @interface TopicInterface
 */
export interface TopicInterface {
  /**
   *
   *
   * @type {number}
   */
  subscriptionID: number;
  /**
   *
   *
   * @type {SessionInterface[]}
   */
  sessions: SessionInterface[];
}
