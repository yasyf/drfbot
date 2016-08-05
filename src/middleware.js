/* @flow */

import type { Entity, Message, SlackBot } from './types';
import { Wit } from 'node-wit';
import config from './config';

const client = new Wit({
  accessToken: config.get('WIT_API_TOKEN'),
  apiVersion: config.get('WIT_API_VERSION'),
});

const MIN_CONFIDENCE = 0.7;

const Middleware = {
  receive(bot: SlackBot, message: Message, next: () => void) {
    message.intent = 'none';
    message.entities = { intent: 'none' };
    if (!message.text) {
      next();
      return;
    }
    client.message(message.text, {}).then(data => {
      if (data.entities.intent) {
        message.intent = data.entities.intent[0].value;
      }
      Object.keys(data.entities).forEach(name => {
        const ents: Array<Entity> = data.entities[name];
        if (ents.length && ents[0].confidence > MIN_CONFIDENCE) {
          message.entities[name] = ents[0].value;
        }
      });
      next();
    });
  },
  hears(intents: Array<string>, message: Message) {
    return message.intent && intents.includes(message.intent);
  },
};

export default Middleware;
