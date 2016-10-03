/* @flow */

import type { Company, Message } from '../types';

import CompanyActionInteraction from './company_action';

import api from '../api';

export default class ClaimInteraction extends CompanyActionInteraction {
  abstract = false;
  patterns = [/^claim (.*)$/i];

  successReply(message: Message, searchTerm: string): ?string {
    return `<@${message.user}>: ${searchTerm} was allocated to you!`;
  }

  failReply(message: Message, searchTerm: string): ?string {
    return `<@${message.user}>: ${searchTerm} could not be allocated to you!`;
  }

  actionPromise(message: Message, company: Company): Promise<void> {
    return api.allocateCompany(company.id, message.user);
  }
}
