/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class PointPartnerQuestionInteraction extends BaseInteraction {
  patterns = [
    /point(?: partner)? (?:for|of) (.*)(?:\?)/i,
    /point(?: partner)? (?:for|of) (.*)/i,
  ];
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleCompanies = companies => {
      if (!companies.size) {
        return;
      }
      const company = companies.first();
      if (!company.partners.length) {
        return;
      }
      const users = company.partners.map(partner => `<@${partner.slack_id}>`);
      const response = `<@${message.user}>: ${users.join(', ')}`
        + ` are the listed partners for ${company.name}`;
      bot.reply(message, response);
    };
    api.searchCompanies(message.match[1]).then(handleCompanies);
  }
}
