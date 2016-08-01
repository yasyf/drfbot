/* @flow */

import * as Immutable from 'immutable';
import type { Controller, Interaction, Logger } from './types';
import Botkit from 'botkit';
import config from './config';
import redisStorage from 'botkit-storage-redis';

export default class Bot {
  controller: Controller;
  logger: Logger;
  interations: Array<Interaction>;

  constructor(options?: Object) {
    this.controller = Botkit.slackbot({
      debug: config.getBool('DEBUG'),
      storage: redisStorage(config.get('REDIS_URL')),
      ...options,
    });
    this.logger = this.controller.log;
    this.interations = [];
  }

  addInteractions(interactions: Array<Interaction>): Promise<mixed> {
    const hookPromises = interactions.map(interaction =>
      this.hookInteraction(interaction).then(_ =>
        this.interations.push(interaction)
      )
    );
    return Promise.all(hookPromises);
  }

  start(token?: string) {
    this.controller.spawn({
      token: token || config.get('SLACK_BOT_TOKEN'),
    }).startRTM();
  }

  hookInteraction(interaction: Interaction): Promise<mixed> {
    return Promise.resolve(interaction.patterns).then(patterns => {
      let hook = interaction.hook;
      if (interaction.messageTypes.includes('ambient')) {
        hook = (bot, message) => {
          if (message.bot_id) {
            return;
          }
          interaction.hook(bot, message);
        };
      }
      return this.controller.hears(
        patterns instanceof Immutable.List ? patterns.toArray() : patterns,
        interaction.messageTypes,
        hook,
      );
    });
  }
}
