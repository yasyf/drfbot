/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyQuestionInteraction extends BaseInteraction {
  patterns = [
    /point(?: partner)? (?:for|of) (.*)(?:\?)/i,
    /point(?: partner)? (?:for|of) (.*)/i,
    /(?:what|who|which) (?:is|was) (.*)\?/i,
    / (\w*)\?/,
    /^(.*)\?/,
    /^(\w*)\?$/,
  ];
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleCompanies = companies => {
      if (!companies.size) {
        return;
      }
      const company = companies.first();
      bot.reply(message, {
        text: `<@${message.user}>: were you talking about this company?`,
        attachments: CompanyQuestionInteraction.textAttachment(
          `<${company.trello_url}|${company.name}>`,
        ),
      });
    };
    api.searchCompanies(message.match[1]).then(handleCompanies);
  }
}
