/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

export default class LadiesAndGentsInteraction extends BaseInteraction {
  patterns = [/(.*)(?:ladies and gent(?:s|lemen))\s?[,:-]?\s?(.*)/i];
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    if (message.text.includes('<!channel>')) {
      return;
    }
    const announcement = `${message.match[1]}${message.match[2]}`.trim();
    bot.reply(message, {
      text: `<!here>: <@${message.user}> would like you to know this!`,
      attachments: LadiesAndGentsInteraction.textAttachment(
        announcement,
      ),
    });
  }
}
