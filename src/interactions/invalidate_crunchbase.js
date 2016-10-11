/* @flow */

import type { Company, Message } from '../types';

import CompanyActionInteraction from './company_action';

import api from '../api';

export default class InvalidateCrunchbaseInteraction
  extends CompanyActionInteraction {
  helpText = 'clears cached CrunchBase information about a company';
  exampleText = '*invalidate* _Spyce_';
  abstract = false;
  patterns = [/^invalidate (.*)$/i];

  successReply(message: Message, searchTerm: string): ?string {
    return (
      `<@${message.user}>: ${searchTerm}'s CrunchBase data has been cleared!`
    );
  }

  failReply(message: Message, searchTerm: string): ?string {
    return (
      `<@${message.user}>: ${searchTerm}'s CrunchBase data`
      + ' could not be cleared!'
    );
  }

  actionPromise(message: Message, company: Company): Promise<void> {
    return api.invalidateCompany(company.id);
  }
}
