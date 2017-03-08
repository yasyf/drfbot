/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';
import config from '../config';

export default class EventInteraction extends BaseInteraction {
  patterns = [/^event ([\w]+)$/i];
  messageTypes = ['direct_mention'];

  hook(bot: SlackBot, message: Message) {
    const eventID = message.match[1];

    const notesCallback = (response, convo) => {
      convo.say('Thanks for that!');
      api.addEventNotes(eventID, response.text).then(response => {
        convo.say(`I've started a Google Doc for you <${response.link}|here>`);
        convo.say('Have an awesome day!');
        convo.next();
      });
    };

    const yesCallback = (response, convo) => {
      convo.say('Awesome! If you get a sec, respond here with a few notes after the meeting');
      convo.ask(
        "Make sure you send the notes as one message so I don't get confused :D",
        notesCallback,
        { multiple: true },
      )
      convo.next();
    };

    const noCallback = (response, convo) => {
      convo.say('My bad, sorry about that!');
      convo.next();
    };

    const handleEventAndCompany = ({ event, company }) => {
      bot.startConversation(message, (err, convo) => {
        convo.say(`Hey <@${message.user}>!`);
        convo.ask(
          {
            text: `Do you have a meeting coming up with ${company.name}?`,
            attachments: EventInteraction.companyAttachment(
              company,
              message,
              bot,
            ),
          },
          [
            {
              pattern: bot.utterances.yes,
              callback: yesCallback,
            },
            {
              pattern: bot.utterances.no,
              callback: noCallback,
            },
          ]
        )
      });
    };

    const handleEvent = event =>
      api.getCompanyByID(event.company_id)
        .then(company => ({ event, company }));

    api
      .getEvent(eventID)
      .then(handleEvent)
      .then(handleEventAndCompany);
  }
}
