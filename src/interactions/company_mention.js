/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';
import Cache from '../cache';

import api from '../api';
import dictionary from '../dictionary';

const MENTION_THRESHOLD = 10800; // seconds == 180 minutes
const MIN_NAME_LENGTH = 4;

const mentionsCache: Cache<boolean> = new Cache();

export default class CompanyMentionInteraction extends BaseInteraction {
  patterns = api.getCompanyPatterns();
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    if (
      !message.entities.company
      || message.entities.company.length < MIN_NAME_LENGTH
      || dictionary.contains(message.entities.company)
    ) {
      return;
    }

    const keyFn = company => `${message.channel}:${company.name}`;

    const handleCompanyAndMention = ({ company, mention }) => {
      mentionsCache.set(keyFn(company), true, MENTION_THRESHOLD);
      if (mention) {
        return;
      }
      bot.reply(message, {
        attachments: CompanyMentionInteraction.companyAttachment(
          company,
          message,
          bot,
        ),
      });
    };
    const handleCompany = company =>
      mentionsCache
        .get(keyFn(company))
        .then(mention => ({ mention, company }));
    api
      .getCompany(message.entities.company)
      .then(handleCompany)
      .then(handleCompanyAndMention);
  }
}
