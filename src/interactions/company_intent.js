/* @flow */

import type { Company, Message, Response, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';
import dictionary from '../dictionary';

export default class CompanyIntentInteraction extends BaseInteraction {
  abstract = true;
  messageTypes = ['ambient', 'direct_mention', 'direct_message'];

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
        .then((response) => {
          if (response) {
            bot.reply(message, response);
          }
        });
    };
    (message.all_entities.company || []).filter(name => !dictionary.contains(name)).forEach(name => {
      api.searchCompanies(name).then(handleCompanies);
    });
  }
}
