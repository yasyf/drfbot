/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

export default class HelpInteraction extends BaseInteraction {
  patterns = ['help'];
  messageTypes = ['direct_mention', 'direct_message'];
  allHelpText: ?string;

  hook(bot: SlackBot, message: Message) {
    if (!this.allHelpText) {
      this.allHelpText = BaseInteraction.genAllHelpText();
    }
    bot.reply(message, {
      text: `<@${message.user}>: here are all the things I can do!`,
      attachments: BaseInteraction.textAttachment(this.allHelpText, true),
    });
  }
}
