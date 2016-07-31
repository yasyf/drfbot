/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class ClaimInteraction extends BaseInteraction {
  patterns = [/^claim (.*)$/];
  messageTypes = ['direct_message', 'direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const searchTerm = message.match[1];
    const handleCompanies = companies =>
      companies.length && api.allocateCompany(companies[0].id, message.user);
    api.searchCompanies(searchTerm).then(handleCompanies);
  }
}
