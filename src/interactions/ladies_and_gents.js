/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

export default class LadiesAndGentsInteraction extends BaseInteraction {
  patterns = [/(.*)ladies and gent(?:s|lemen)\s?[,:-]?(.*)/];
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const announcement = `${message.match[1]}${message.match[2]}`.trim();
    bot.reply(message, {
      text: `<!channel>: <@${message.user}> would like you to know this!`,
      attachments: LadiesAndGentsInteraction.textAttachment(
        announcement,
      ),
    });
  }
}
