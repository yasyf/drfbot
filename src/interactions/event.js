/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import api from '../api';
import config from '../config';

export default class EventInteraction extends BaseInteraction {
  patterns = [/^calendar_event ([\w]+) ([\w]+)$/i];
  messageTypes = ['direct_message'];

  hook(bot: SlackBot, message: Message) {
    const userID = message.match[1];
    const eventID = message.match[2];
    var respondTo, timeout;

    const notesCallback = (convo) => {
      convo.say('Thanks for that!');
      let response = convo.extractResponse('notes');
      api.addEventNotes(eventID, response).then(response => {
        convo.say(`I've started a Google Doc for you <${response.link}|here>`);
        convo.say('Have an awesome day!');
        convo.next();
      });
    };

    const yesCallback = (response, convo) => {
      convo.ask(
        'Awesome! If you have a sec, send me a few notes about how the meeting went',
        (response, convo) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => { notesCallback(convo); }, 1000 * 60 * 0.5);
        },
        { multiple: true, key: 'notes' },
      );
      convo.next();
    };

    const noCallback = (response, convo) => {
      convo.say('My bad, sorry about that!');
      api.invalidateEvent(eventID).then(() => convo.next());
    };

    const handleCompany = company => {
      bot.api.im.open({ user: userID }, (err, imMeta) => {
        if (err) {
          return;
        }
        respondTo = { channel: imMeta.channel.id, user: userID };
        bot.startConversation(respondTo, (err, convo) => {
          convo.say(`Hey <@${userID}>!`);
          convo.ask(
            {
              text: `Did you just have a meeting with ${company.name}?`,
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
      });
    };

    const handleEvent = event =>
      api.getCompanyByID(event.company_id)

    api
      .getEvent(eventID)
      .then(handleEvent)
      .then(handleCompany);
  }
}
