/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';
import dictionary from '../dictionary';

const MIN_NAME_LENGTH = 3;

export default class CompanyMentionInteraction extends BaseInteraction {
  patterns = api.getCompanyPatterns();
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleCompany = company => {
      if (
        company.name.length < MIN_NAME_LENGTH
        || dictionary.contains(company.name)
      ) {
        return;
      }
      bot.reply(message, {
        attachments: CompanyMentionInteraction.companyAttachment(company),
      });
    };
    api.getCompany(message.match[0]).then(handleCompany);
  }
}
