/* @flow */

import type { Company, Message, Response } from '../types';

import CompanyIntentInteraction from './company_intent';

export default class SnapshotQuestionInteraction
  extends CompanyIntentInteraction {
  abstract = false;
  intents = ['snapshot'];

  responseFromCompany(company: Company, message: Message): ?Response {
    const snapshotLink = company.snapshot_link;
    if (!snapshotLink) {
      return null;
    }
    const response = `<${snapshotLink}|${company.name} Snapshot>`;
    return {
      text: `<@${message.user}>`,
      attachments: SnapshotQuestionInteraction.textAttachment(response),
    };
  }
}
