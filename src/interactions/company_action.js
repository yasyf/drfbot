/* @flow */

import type { Company, Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyActionInteraction extends BaseInteraction {
  abstract = true;
  messageTypes = ['direct_message', 'direct_mention'];

  successReply(_message: Message, _searchTerm: string): ?string {
    return null;
  }

  failReply(_message: Message, _searchTerm: string): ?string {
    return null;
  }

  actionPromise(_message: Message, _company: Company): Promise<void> {
    return Promise.resolve();
  }

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleAction = success => {
      let reply;
      if (success) {
        reply = this.successReply(message, searchTerm);
      } else {
        reply = this.failReply(message, searchTerm);
      }
      if (reply) {
        bot.reply(message, reply);
      }
    };
    const handleCompanies = companies => {
      if (companies.size === 0) {
        const reply = `<@${message.user}>: ${searchTerm} was not found!`;
        bot.reply(message, reply);
        return;
      }

      this.actionPromise(message, companies.first())
        .then(() => handleAction(true))
        .catch(() => handleAction(false));
    };
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
