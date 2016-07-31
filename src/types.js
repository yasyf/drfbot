/* @flow */

export type Message = {
  channel: string,
  event: string,
  match: Array<string>,
  team: string,
  text: string,
  ts: string,
  user: string,
};
export type Attachments = Array<Object>;
type Response = {
  attachments: Attachments,
  text: string,
};
type MessageType = 'direct_message' | 'ambient' | 'direct_mention' | 'mention';
export type MessageTypes = 'message_received' | Array<MessageType>;
type Patterns = Array<string>;

export type SlackBot = {
  reply: (message: Message, response: string|Response) => void,
};

export type Hook = (bot: SlackBot, message: Message) => void;

export type Controller = {
  hears: (patterns: Patterns, messageTypes: MessageTypes, hook: Hook) => void,
  spawn: (options: {token: string}) => any,
};

export interface Interaction {
  patterns: Patterns;
  messageTypes: MessageTypes;
  hook: Hook;
}
