/* @flow */

import type { Company, Message, Response, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyIntentInteraction extends BaseInteraction {
  abstract = true;
  messageTypes = ['ambient', 'direct_mention'];

  responseFromCompany(
    _company: Company,
    _message: Message
  ): ?string | ?Response | Promise<?string> | Promise<?Response> {
    return null;
  }

  hook(bot: SlackBot, message: Message) {
    const handleCompanies = companies => {
      if (!companies.size) {
        return;
      }
      const company = companies.first();
      if (!company.partners.length) {
        return;
      }
      Promise
        .resolve(this.responseFromCompany(company, message))
        .then(response => {
          if (response) {
            bot.reply(message, response);
          }
        });
    };
    api.searchCompanies(message.entities.company).then(handleCompanies);
  }
}
