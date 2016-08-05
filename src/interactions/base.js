/* eslint global-require: "off" */
/* @flow */

import type {
  AsyncPatterns,
  Attachments,
  Company,
  Intent,
  Interaction,
  MessageTypes,
} from '../types';

import { API } from '../api';
import fs from 'fs';

export default class BaseInteraction {
  intents: ?Array<Intent>;
  patterns: ?AsyncPatterns;
  messageTypes: MessageTypes = 'message_received';

  static loadAll(): Array<Interaction> {
    return fs.readdirSync(__dirname).map(file => {
      const InteractionClass = require(`./${file}`).default;
      return new InteractionClass();
    }).filter(x => x.constructor !== BaseInteraction);
  }

  static textAttachment(text: string): Attachments {
    return [{ text }];
  }

  static companyAttachment(company: Company): Attachments {
    let color = 'danger';
    let status = 'Passed';
    let fields = [];
    if (!company.pitch_on) {
      color = '#d3d3d3';
      status = 'In Pipeline';
    } else if (!company.pitched) {
      color = '#439FE0';
      status = 'Pitch Scheduled';
    } else if (!company.past_deadline) {
      color = 'warning';
      status = 'In Voting';
    } else if (company.funded) {
      color = 'good';
      status = 'Funded';
    }

    if (company.pitched && company.past_deadline) {
      const { stats } = company;
      const { averages } = stats;
      fields = [
        { title: 'Yes Votes', value: stats.yes_votes, short: true },
        { title: 'No Votes', value: stats.no_votes, short: true },
        { title: 'Fit', value: averages.fit.toFixed(2), short: true },
        { title: 'Team', value: averages.team.toFixed(2), short: true },
        { title: 'Product', value: averages.product.toFixed(2), short: true },
        { title: 'Market', value: averages.market.toFixed(2), short: true },
      ];
    }

    let partners = 'No partners assigned';
    if (company.partners.length) {
      const users = company.partners.map(partner => `<@${partner.slack_id}>`);
      partners = `Partners: ${users.join(', ')}`;
    }

    const footerItems = [`<${company.trello_url}|Trello>`];
    if (company.snapshot_link) {
      footerItems.push(`<${company.snapshot_link}|Snapshot>`);
    }
    const footer = footerItems.join(' | ');

    const attachment = {
      fallback: `${company.name} (${company.trello_url})`,
      color,
      footer,
      title: company.name,
      title_link: API.url(`companies/${company.id}`),
      text: `${status}. ${partners}.`,
      fields,
      ts: company.pitch_on,
    };
    return [attachment];
  }
}
