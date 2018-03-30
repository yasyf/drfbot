/* eslint global-require: "off" */
/* @flow */

import type {
  AsyncPatterns,
  Attachments,
  Company,
  Intent,
  Message,
  MessageTypes,
  SlackBot,
} from '../types';

import { API } from '../api';
import fs from 'fs';
import _ from 'lodash';

export default class BaseInteraction {
  helpText: ?string;
  exampleText: ?string;
  abstract: boolean = false;
  intents: Array<Intent> | void;
  patterns: AsyncPatterns | void;
  messageTypes: MessageTypes = 'message_received';

  hook(_bot: SlackBot, _message: Message) {
    throw new Error('Subclass of BaseInteraction must define hook()!');
  }

  static genAllHelpText(): string {
    return this.loadAll()
      .filter(interaction => interaction.exampleText)
      .map((interaction) => {
        let text = '';
        if (!interaction.messageTypes.includes('ambient')) {
          text = '@drfbot: ';
        }
        text = `${text}${interaction.exampleText}`;
        if (interaction.helpText) {
          text = `${text}\n\t${interaction.helpText}`;
        }
        return text;
      })
      .join('\n');
  }

  static loadAll(): Array<BaseInteraction> {
    return fs.readdirSync(__dirname).map((file) => {
      const InteractionClass = require(`./${file}`).default;
      return new InteractionClass();
    }).filter(x => x.constructor !== BaseInteraction && !x.abstract);
  }

  static textAttachment(text: string, format?: boolean): Attachments {
    return [{ text, mrkdwn_in: format ? ['text'] : [] }];
  }

  static companyAttachment(
    company: Company,
    message: Message,
    bot: SlackBot,
  ): Attachments {
    let color, status;
    const fields = [];
    if (company.funded) {
      color = 'good';
      status = 'Funded';
    } else if (company.passed) {
      color = 'danger';
      status = 'Passed (No Pitch)';
    } else if (!company.pitched && company.pitch_on) {
      color = '#439FE0';
      status = 'Pitch Scheduled';
    } else if (!company.past_deadline && company.pitch_on) {
      color = 'warning';
      status = 'In Voting';
    } else {
      color = '#d3d3d3';
      status = 'In Pipeline';
    }

    let partners;
    if (company.partners.length) {
      const users = company.partners.map(partner => `<@${partner.slack_id}>`);
      partners = users.join(', ');
    } else {
      partners = 'No partners assigned';
    }

    let competitors;
    if (company.competitors.length) {
      competitors = _.sampleSize(company.competitors, 3).map(competitor => competitor.name).join(', ');
    } else {
      competitors = '✗';
    }

    fields.push(...[
      { title: 'Status', value: status, short: true },
      { title: 'Partners', value: partners, short: true },
      { title: 'Investors', value: competitors, short: true },
      { title: 'Raised', value: company.capital_raised, short: true },
    ]);

    if (company.pitched && company.past_deadline) {
      const { stats } = company;
      const { averages } = stats;

      fields.push(...[
        { title: 'Yes Votes', value: stats.yes_votes, short: true },
        { title: 'No Votes', value: stats.no_votes, short: true },
        { title: 'Fit', value: averages.fit.toFixed(2), short: true },
        { title: 'Team', value: averages.team.toFixed(2), short: true },
        { title: 'Product', value: averages.product.toFixed(2), short: true },
        { title: 'Market', value: averages.market.toFixed(2), short: true },
      ]);
    }

    let thumbUrl;
    if (company.domain) {
      thumbUrl =
        `https://icons.better-idea.org/icon?url=${company.domain}&size=75`;
    }

    const footerItems = [`<${company.trello_url}|Trello>`];
    if (company.snapshot_link) {
      footerItems.push(`<${company.snapshot_link}|Snapshot>`);
    }
    const reportURL =
      API.url(`feedback?channel=${message.channel}&bot=${bot.identity.id}`);
    footerItems.push(`<${reportURL}|Report>`);
    const footer = footerItems.join(' | ');

    const attachment = {
      fallback: `${company.name} (${company.trello_url})`,
      color,
      footer,
      thumb_url: thumbUrl,
      title: company.name,
      title_link: API.url(`companies/${company.id}`),
      text: company.description,
      fields,
      ts: company.pitch_on,
    };
    return [attachment];
  }
}
