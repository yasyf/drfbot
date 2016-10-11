/* @flow */

import type { Message, SlackBot } from '../types';

import fetch from '../fetch';

const MAX_OFFSET = 100;

export default class SendLoveInteraction {
  helpText = 'sends some love to a fellow partner';
  exampleText = 'Send some love to _@yasyf_';
  messageTypes = ['ambient'];
  intents = ['send_love'];

  hook(bot: SlackBot, message: Message) {
    if (!message.entities.slack_user) {
      return;
    }
    const rand = Math.floor(Math.random() * MAX_OFFSET);
    const url =
      `http://api.giphy.com/v1/gifs/search?q=love&api_key=dc6zaTOxFJmzC&limit=1&offset=${rand}`;
    fetch(url).then((body) => {
      const imageUrl = body.data[0].images.original.url;
      bot.reply(message, {
        text: `${message.entities.slack_user}, this one's for you!`,
        attachments: [{
          text: `From <@${message.user}> with love!`,
          image_url: imageUrl,
        }],
      });
    });
  }
}
