/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyMentionInteraction extends BaseInteraction {
  patterns = api.getCompanyPatterns();
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleCompany = company => {
      bot.reply(message, {
        attachments: CompanyMentionInteraction.companyAttachment(company),
      });
    };
    api.getCompany(message.match[0]).then(handleCompany);
  }
}
