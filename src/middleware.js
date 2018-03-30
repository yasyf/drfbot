/* @flow */

import type { Entity, Message, SlackBot } from './types';
import { Wit } from 'node-wit';
import config from './config';
import util from './util';

const client = new Wit({
  accessToken: config.get('WIT_API_TOKEN'),
  apiVersion: config.get('WIT_API_VERSION'),
});

const MAX_MESSAGE_LENGTH = 256;
const MIN_CONFIDENCE = 0.7;

const Middleware = {
  receive(bot: SlackBot, message: Message, next: () => void) {
    message.intent = 'none';
    message.entities = { intent: 'none' };
    message.all_entities = { };
    if (!message.text || message.text.length > MAX_MESSAGE_LENGTH) {
      next();
      return;
    }
    client.message(message.text, {}).then((data) => {
      if (data.entities.intent) {
        message.intent = data.entities.intent[0].value;
      }
      Object.keys(data.entities).forEach((name) => {
        const ents: Array<Entity> = data.entities[name];
        message.all_entities[name] = ents.map(ent => ent.value);
        for (const ent of ents) {
          if (ent.confidence > MIN_CONFIDENCE) {
            message.entities[name] = ent.value;
            break;
          }
        }
      });
      next();
    }).catch((err) => {
      util.warn(err);
      next();
    });
  },
  hears(intents: Array<string>, message: Message) {
    return message.intent && intents.includes(message.intent);
  },
};

export default Middleware;
