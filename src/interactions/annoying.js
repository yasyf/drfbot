/* @flow */

import type { Message, SlackBot } from '../types';

import BaseInteraction from './base';

import config from '../config';

export default class AnnoyingInteraction extends BaseInteraction {
  patterns = ['annoying'];
  messageTypes = ['direct_mention'];

  hook(bot: SlackBot, message: Message) {
    let lastMessage;
    let timestamp;
    let channelName;
    let domain;

    const annoyedUser =
      message.entities.slack_user
      ? message.entities.slack_user.slice(1, -1)
      : message.user;
    const users = [
      bot.identity.id,
      annoyedUser,
      config.get('COMPLAINT_USER'),
    ].join(',');

    const handleMPIMOpen = (err, channelMeta) => {
      if (err) {
        return;
      }
      const channel = channelMeta.group.id;
      const url =
        `https://${domain}.slack.com/archives/${channelName}/p${timestamp}`;
      const text =
        'Okay!'
        + ` <@${annoyedUser}> found something annoying in <#${message.channel}>.`
        + " I've duplicated it above. Let's figure out what went wrong!"
        + `\n<@${annoyedUser}>, can you give <@${config.get('COMPLAINT_USER')}>`
        + ` some more details on what you disliked about ${url}?`;
      bot.say({ channel, ...lastMessage }, () => {
        bot.say({ channel, text });
      });
    };
    const handleTeamInfo = (err, teamMeta) => {
      domain = teamMeta.team.domain;
      bot.api.mpim.open({ users }, handleMPIMOpen);
    };
    const handleChannelInfo = (err, channelMeta) => {
      if (err) {
        return;
      }
      channelName = channelMeta.channel.name;
      bot.api.team.info({}, handleTeamInfo);
    };
    const handleSearchResults = (err, results: { messages: Array<Object> }) => {
      if (err) {
        return;
      }
      lastMessage =
        results.messages.find(res => res.user === bot.identity.id);
      timestamp = lastMessage.ts.replace('.', '');
      bot.api.channels.info({ channel: message.channel }, handleChannelInfo);
    };
    bot.api.channels.history(
      { channel: message.channel },
      handleSearchResults,
    );
  }
}
