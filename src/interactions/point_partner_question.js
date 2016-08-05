/* @flow */

import type { Company, Message } from '../types';

import CompanyIntentInteraction from './company_intent';

export default class PointPartnerQuestionInteraction
  extends CompanyIntentInteraction {
  abstract = false;
  intents = ['point_partner'];

  responseFromCompany(company: Company, message: Message): ?string {
    const users = company.partners.map(partner => `<@${partner.slack_id}>`);
    return `<@${message.user}>: ${users.join(', ')}`
      + ` are the listed partners for ${company.name}`;
  }
}
