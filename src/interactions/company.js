/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyInteraction extends BaseInteraction {
  patterns = [/^company (.*)$/];
  messageTypes = ['direct_message', 'direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleCompanies = companies => {
      let reply;
      if (companies.length === 0) {
        reply = `<@${message.user}>: ${searchTerm} was not found!`;
      } else {
        const company = companies[0];
        reply = `<@${message.user}>: <${company.trello_url}|${company.name}>`;
      }
      bot.reply(message, reply);
    };
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
