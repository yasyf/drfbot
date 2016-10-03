/* @flow */

import BaseInteraction from './interactions/base';
import Bot from './bot';
import type { Interaction } from './types';
import util from './util';

const allInteractions: Array<Interaction> =
  BaseInteraction.loadAll().map(x => (x: Interaction));

const bot = new Bot();
bot
  .addInteractions(allInteractions)
  .then(_ => bot.start())
  .catch(util.error);
