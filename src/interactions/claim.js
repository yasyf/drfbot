/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class ClaimInteraction extends BaseInteraction {
  patterns = [/^claim (.*)$/i];
  messageTypes = ['direct_message', 'direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleAllocate = success => {
      let reply;
      if (success) {
        reply = `<@${message.user}>: ${searchTerm} was allocated to you!`;
      } else {
        reply =
          `<@${message.user}>: ${searchTerm} could not be allocated to you!`;
      }
      bot.reply(message, reply);
    };
    const handleCompanies = companies => {
      if (companies.size === 0) {
        const reply = `<@${message.user}>: ${searchTerm} was not found!`;
        bot.reply(message, reply);
        return;
      }
      api.allocateCompany(companies.first().id, message.user)
        .then(() => handleAllocate(true))
        .catch(() => handleAllocate(false));
    };
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
