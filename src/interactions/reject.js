/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class RejectInteraction extends BaseInteraction {
  patterns = [/^reject (.*)$/i];
  messageTypes = ['direct_message', 'direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleReject = success => {
      let reply;
      if (success) {
        reply = `<@${message.user}>: ${searchTerm} was rejected!`;
      } else {
        reply =
          `<@${message.user}>: ${searchTerm} could not be rejected!`;
      }
      bot.reply(message, reply);
    };
    const handleCompanies = companies => {
      if (companies.size === 0) {
        const reply = `<@${message.user}>: ${searchTerm} was not found!`;
        bot.reply(message, reply);
        return;
      }
      api.rejectCompany(companies.first().id)
        .then(() => handleReject(true))
        .catch(() => handleReject(false));
    };
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
