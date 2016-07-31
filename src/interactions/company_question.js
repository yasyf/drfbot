/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyQuestionInteraction extends BaseInteraction {
  patterns = [
    /^(?:what|who) (?:is|was) (.*)\?$/i,
    / (\w*)\?/,
    /^(.*)\?/,
    /^(\w*)\?$/,
  ];
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleCompanies = companies => {
      if (!companies.length) {
        return;
      }
      bot.reply(message, {
        text: `<@${message.user}>: were you talking about this company?`,
        attachments: CompanyQuestionInteraction.textAttachment(
          `<${companies[0].trello_url}|${companies[0].name}>`,
        ),
      });
    };
    api.searchCompanies(message.match[1]).then(handleCompanies);
  }
}
