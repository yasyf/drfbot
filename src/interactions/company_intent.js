/* @flow */

import type { Company, Message, Response, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';

export default class CompanyIntentInteraction extends BaseInteraction {
  abstract = true;
  messageTypes = ['ambient'];

  responseFromCompany(
    _company: Company,
    _message: Message
  ): ?string | ?Response {
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
      const response = this.responseFromCompany(company, message);
      if (response) {
        bot.reply(message, response);
      }
    };
    api.searchCompanies(message.entities.company).then(handleCompanies);
  }
}
