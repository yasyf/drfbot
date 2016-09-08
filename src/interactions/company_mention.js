/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';
import dictionary from '../dictionary';
import moment from 'moment';
import util from '../util';

const MENTION_THRESHOLD = 60; // minutes
const MIN_NAME_LENGTH = 3;

export default class CompanyMentionInteraction extends BaseInteraction {
  patterns = api.getCompanyPatterns();
  messageTypes = ['ambient'];

  hook(bot: SlackBot, message: Message) {
    const handleMentions = (company, mentions) => {
      if (
        company.name.length < MIN_NAME_LENGTH
        || dictionary.contains(company.name)
      ) {
        return;
      }
      const lastMention = mentions[company.name];
      mentions[company.name] = moment();
      bot.botkit.storage.channels.save(
        {
          id: message.channel,
          companyMentions: mentions,
        },
        util.warn,
      );

      if (
        lastMention
        && moment().diff(moment(lastMention), 'minutes') < MENTION_THRESHOLD
      ) {
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
    const handleCompany = company => {
      bot.botkit.storage.channels.get(message.channel, (err, channelData) => {
        if (err) {
          util.warn(err);
        } else {
          handleMentions(company, (channelData || {}).companyMentions || {});
        }
      });
    };
    api.getCompany(message.match[0]).then(handleCompany);
  }
}
