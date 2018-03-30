/* @flow */

import type { Company, Message, Response } from '../types';

import CompanyIntentInteraction from './company_intent';

export default class SnapshotQuestionInteraction
  extends CompanyIntentInteraction {
  helpText = 'shows the snapshot for a company';
  exampleText = 'Where is the snapshot for _Spyce_?';
  abstract = false;
  intents = ['snapshot'];

  responseFromCompany(company: Company, message: Message): ?Response {
    const snapshotLink = company.snapshot_link;

    let response;
    if (snapshotLink) {
      response = `<${snapshotLink}|${company.name} Snapshot>`;
    } else {
      response = `I can't find the snapshot. Try asking ${company.partners.map(partner => `<@${partner.slack_id}>`).join(', ')}!`;
    }
    return {
      text: `<@${message.user}>`,
      attachments: SnapshotQuestionInteraction.textAttachment(response),
    };
  }
}
