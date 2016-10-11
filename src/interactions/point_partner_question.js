/* @flow */

import type { Company, Message } from '../types';

import CompanyIntentInteraction from './company_intent';

export default class PointPartnerQuestionInteraction
  extends CompanyIntentInteraction {
  helpText = 'shows the assigned parners for a company';
  exampleText = 'Who are the point partners for _Spyce_?';
  abstract = false;
  intents = ['point_partner'];

  responseFromCompany(company: Company, message: Message): ?string {
    const users = company.partners.map(partner => `<@${partner.slack_id}>`);
    return `<@${message.user}>: ${users.join(', ')}`
      + ` are the listed partners for ${company.name}`;
  }
}
