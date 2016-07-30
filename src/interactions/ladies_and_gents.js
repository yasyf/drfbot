/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

export default class LadiesAndGentsInteraction extends BaseInteraction {
  patterns = ['ladies and gent(s|lemen)'];
  messageTypes = ['direct_message'];

  hook(bot: SlackBot, message: Message) {
    bot.reply(message, 'test');
  }
}
