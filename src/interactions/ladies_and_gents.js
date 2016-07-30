/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

export default class LadiesAndGentsInteraction extends BaseInteraction {
  patterns = [/(.*)ladies and gent(?:s|lemen)\s?[,:-]?(.*)/];
  messageTypes = ['direct_message'];

  hook(bot: SlackBot, message: Message) {
    const announcement = `${message.match[1]}${message.match[2]}`.trim();
    const channelAnnouncement =
      `<!channel>: <@${message.user}> would like you to know ${announcement}`;
    bot.reply(message, channelAnnouncement);
  }
}
