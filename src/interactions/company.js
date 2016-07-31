/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyInteraction extends BaseInteraction {
  patterns = [/^company (.*)$/i];
  messageTypes = ['direct_message', 'direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleCompanies = companies => {
      if (companies.length === 0) {
        const reply = `<@${message.user}>: ${searchTerm} was not found!`;
        bot.reply(message, reply);
      } else {
        bot.reply(message, {
          text: `<@${message.user}>`,
          attachments: CompanyInteraction.textAttachment(
            `<${companies[0].trello_url}|${companies[0].name}>`,
          ),
        });
      }
    };
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
