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

    const handleCompany = company => {
      bot.api.im.open({ user: userID }, (err, imMeta) => {
        if (err) {
          return;
        }
        let respondTo = { channel: imMeta.channel.id, user: message.user };
        bot.startConversation(respondTo, (err, convo) => {
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
