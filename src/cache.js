/* @flow */

import config from './config';
import redis from 'redis';
import util from './util';

const NAMESPACE = 'botkit:custom:cache';

export default class Cache<T> {
  client: Object;

  constructor() {
    this.client = redis.createClient(config.get('REDIS_URL'), {
      prefix: NAMESPACE,
    });
  }

  set(key: string, value: T): Promise<T> {
    const encoded = JSON.stringify(value);
    return util
      .promisify(handleFn => this.client.set(key, encoded, handleFn))
      .then(_result => value);
  }

  get(key: string): Promise<T> {
    return util
      .promisify(handleFn => this.client.get(key, handleFn))
      .then(result => JSON.parse(result));
  }

  getOrGenerate(key: string, genFn: () => Promise<T>): Promise<T> {
    return this.get(key).then(result => {
      if (result !== null) {
        return result;
      }
      return genFn().then(value => this.set(key, value));
    });
  }
}
