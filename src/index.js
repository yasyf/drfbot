/* @flow */

import Bot from './bot';
import Interaction from './interactions/base';

const bot = new Bot();
bot.addInteractions(Interaction.loadAll());
bot.start();
