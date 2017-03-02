/* @flow */

import * as Immutable from 'immutable';
import type { Controller, Interaction, Logger } from './types';
import Botkit from 'botkit';
import config from './config';
import middleware from './middleware';
import redisStorage from 'botkit-storage-redis';
import util from './util';

const ONE_HOUR = 3600000;

export default class Bot {
  controller: Controller;
  logger: Logger;
  interations: Array<Interaction>;

  constructor(options?: Object) {
    this.controller = Botkit.slackbot({
      debug: config.getBool('DEBUG'),
      storage: redisStorage(config.get('REDIS_URL')),
      studio_token: config.get('STUDIO_TOKEN'),
      ...options,
    });
    this.controller.middleware.receive.use(middleware.receive);
    this.logger = this.controller.log;
    this.interations = [];
    this.bot = this.controller.spawn({
      token: (options && options.token) || config.get('SLACK_BOT_TOKEN'),
      retry: Infinity,
    });
  }

  addInteractions(interactions: Array<Interaction>): Promise<mixed> {
    const hookPromises = interactions.map(interaction =>
      this.hookInteraction(interaction).then(_ =>
        this.interations.push(interaction)
      )
    );
    this.controller.on('direct_message,direct_mention,mention', (bot, message) =>
      this.controller.studio.runTrigger(bot, message.text, message.user, message.channel).catch(err =>
        bot.reply(message, `I experienced an error with a request to Botkit Studio: ${err}`)
      )
    );
    return Promise.all(hookPromises);
  }

  restart() {
    this.bot.closeRTM();
    this.bot.startRTM();
  }

  start() {
    this.controller.on('rtm_failed', this.restart.bind(this));
    this.controller.on('rtm_reconnect_failed', this.restart.bind(this));
    this.bot.startRTM();
    setInterval(this.restart.bind(this), ONE_HOUR);
  }

  hookInteraction(interaction: Interaction): Promise<mixed> {
    return Promise.resolve(interaction.patterns).then(patterns => {
      let hook;
      if (interaction.messageTypes.includes('ambient')) {
        hook = (bot, message) => {
          if (message.bot_id) {
            return;
          }
          interaction.hook(bot, message);
        };
      } else {
        hook = (bot, message) => {
          interaction.hook(bot, message);
        };
      }
      const wrappedHook = (...args) => {
        try {
          hook(...args);
        } catch (e) {
          util.warn(e);
        }
      };
      if (interaction.intents) {
        return this.controller.hears(
          interaction.intents,
          interaction.messageTypes,
          middleware.hears,
          wrappedHook,
        );
      }
      return this.controller.hears(
        patterns instanceof Immutable.List ? patterns.toArray() : patterns,
        interaction.messageTypes,
        wrappedHook,
      );
    });
  }
}
