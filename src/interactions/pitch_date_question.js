/* @flow */

import type { Company, Message } from '../types';

import CompanyIntentInteraction from './company_intent';

import moment from 'moment';

export default class PitchDateQuestionInteraction
  extends CompanyIntentInteraction {
  helpText = 'shows when a company is pitching';
  exampleText = "When is _Spyce_ pitching?";
  abstract = false;
  intents = ['pitch_date'];

  responseFromCompany(company: Company, message: Message): ?string {
    if (!company.pitch_on) {
      return `<@${message.user}>: I don't see a scheduled pitch for ${company.name}.`;
    }
    const when = moment.unix(company.pitch_on);
    if (moment().diff(when) > 0) {
      return `<@${message.user}>: ${company.name} pitched ${company.team} ${when.fromNow()}.`;
    } else {
      return `<@${message.user}>: ${company.name} is coming in to ${company.team} ${when.calendar(null, {
        sameDay: '[today]',
        nextDay: '[tomorrow]',
        lastDay: '[yesterday]',
        lastWeek: '[last] dddd',
        sameElse: "[on] dddd MMM Do [at] h:mm A",
      })}!`;
    }
  }
}
