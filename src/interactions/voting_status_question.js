/* @flow */

import type { Company, Message } from '../types';

import CompanyIntentInteraction from './company_intent';

import api from '../api';

export default class VotingStatusQuestionInteraction
  extends CompanyIntentInteraction {
  abstract = false;
  intents = ['voting_status'];

  responseFromCompany(company: Company, message: Message): Promise<?string> {
    const handleVotingStatus = votingStatus => {
      switch (votingStatus.status) {
        case 'not_started':
          return `<@${message.user}>: Voting has not yet started`;
        case 'missing_users': {
          const users =
            votingStatus.users.map(user => `<@${user.slack_id}>`).join(', ');
          return `<@${message.user}>: Waiting on votes from ${users}`;
        }
        case 'complete': {
          const not = votingStatus.funded ? '' : ' not';
          return (
            `<@${message.user}>: Voting is complete!`
            + ` We will${not} be funding ${company.name}`
          );
        }
        default:
          return null;
      }
    };
    return api.getVotingStatus(company.id).then(handleVotingStatus);
  }
}
