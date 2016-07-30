/* @flow */

import type { Controller, Interaction } from './types';

import Botkit from 'botkit';
import config from './config';

export default class Bot {
  controller: Controller;
  interations: Array<Interaction>;

  constructor(options?: Object) {
    this.controller = Botkit.slackbot(options);
    this.interations = [];
  }

  addInteractions(interactions: Array<Interaction>) {
    interactions.forEach(this.hookInteraction.bind(this));
    this.interations.push(...interactions);
  }

  start(token?: string) {
    this.controller.spawn({
      token: token || config.get('SLACK_BOT_TOKEN'),
    }).startRTM();
  }

  hookInteraction(interaction: Interaction) {
    this.controller.hears(
      interaction.patterns,
      interaction.messageTypes,
      interaction.hook,
    );
  }
}
