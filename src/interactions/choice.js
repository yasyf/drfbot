/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';
import util from '../util';

export default class ChoiceInteraction extends BaseInteraction {
  helpText = 'selects randomly from the given options';
  exampleText = '*choose* _red, green, blue_';
  patterns = [/^(?:choose|choice|pick|random) ((?:[\w\s]+,?)+)/i];
  messageTypes = ['direct_mention', 'direct_message'];

  hook(bot: SlackBot, message: Message) {
    const options = message.match[1].split(/, ?/);
    const index = util.randInt(0, options.length - 1);
    const selected = options[index];
    const percent = Number(((1 / options.length) * 100).toFixed(2));
    const attachment = {
      fields: [{ value: selected, title: `Option ${index + 1}` }],
      color: 'good',
    };
    bot.reply(message, {
      text: `<@${message.user}>: this lucky option only had a`
        + ` ${percent}% chance of being chosen!`,
      attachments: [attachment],
    });
  }
}
