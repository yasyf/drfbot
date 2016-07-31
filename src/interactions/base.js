/* eslint global-require: "off" */
/* @flow */

import type { Attachments, Interaction, MessageTypes } from '../types';

import fs from 'fs';

export default class BaseInteraction {
  messageTypes: MessageTypes = 'message_received';

  static loadAll(): Array<Interaction> {
    return fs.readdirSync(__dirname).map(file => {
      const InteractionClass = require(`./${file}`).default;
      return new InteractionClass();
    }).filter(x => x.constructor !== BaseInteraction);
  }

  static textAttachment(text: string): Attachments {
    return [{ text }];
  }
}
