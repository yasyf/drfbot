/* @flow */

import type { Company, Message } from '../types';

import CompanyActionInteraction from './company_action';

import api from '../api';

export default class RejectInteraction extends CompanyActionInteraction {
  helpText = 'passes on a company';
  exampleText = '*reject* _Spyce_'
  abstract = false;
  patterns = [/^reject (.*)$/i];

  successReply(message: Message, searchTerm: string): ?string {
    return `<@${message.user}>: ${searchTerm} was rejected!`;
  }

  failReply(message: Message, searchTerm: string): ?string {
    return `<@${message.user}>: ${searchTerm} could not be rejected!`;
  }

  actionPromise(message: Message, company: Company): Promise<void> {
    return api.rejectCompany(company.id);
  }
}
