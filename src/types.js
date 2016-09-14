/* @flow */

import * as Immutable from 'immutable';

export type Entity = {
  confidence: number,
  value: string,
};
export type Intent =
  'none' | 'point_partner' | 'snapshot' | 'send_love' | 'voting_status';
export type Message = {
  bot_id?: string,
  channel: string,
  event: string,
  match: Array<string>,
  team: string,
  text: string,
  ts: string,
  user: string,
  entities: { intent: Intent } & { [name: string]: string },
  intent: Intent,
};
export type Attachments = Array<Object>;
export type Response = {
  attachments?: Attachments,
  text?: string,
};
type MessageType = 'direct_message' | 'ambient' | 'direct_mention' | 'mention';
export type MessageTypes = 'message_received' | Array<MessageType>;
export type Pattern = string | RegExp;
type Patterns = Array<Pattern> | Immutable.List<Pattern>;
export type AsyncPatterns = Patterns | Promise<Patterns>;

type StoredObjectID = string;
type StoredObject = {
  id: StoredObjectID,
} & {[key: string]: any};
type ErrorCallback = (err: Object) => void;
type DataCallback = (err: Object, data: StoredObject) => void;
type AllDataCallback = (err: Object, data: Array<StoredObject>) => void;
type StorageStore = {
  save: (object: StoredObject, errCb: ErrorCallback) => void,
  get: (id: StoredObjectID, dataCb: DataCallback) => void,
  all: (allDataCb: AllDataCallback) => void,
};
type Storage = {
  channels: StorageStore,
  teams: StorageStore,
  users: StorageStore,
};

export type Logger = {
  info: (message: string) => void,
  warning: (message: string) => void,
  error: (message: string) => void,
}

export type SlackBot = {
  api: Object,
  botkit: {
    storage: Storage,
  },
  identity: Object,
  logger: Logger,
  reply: (message: Message, response: string|Response) => void,
  say: (message: { channel: string, text: string }) => void,
};

export type Hook = (bot: SlackBot, message: Message) => void;

export type Controller = {
  log: Logger,
  hears: any,
  spawn: (options: {token: string}) => any,
  middleware: {
    receive: Object,
    send: Object,
  },
  storage: Storage,
};

export type Interaction = {
  hook: Hook;
  messageTypes: MessageTypes;
  patterns: AsyncPatterns | void;
  intents: Array<Intent> | void;
}

type Partner = {
  name: string,
  slack_id: string,
}
export type Company = {
  domain: ?string,
  description: ?string,
  funded: boolean,
  id: number,
  name: string,
  partners: Array<Partner>,
  past_deadline: boolean,
  pitch_on: ?number,
  pitched: boolean,
  snapshot_link: ?string,
  rdv_funded: boolean,
  capital_raised: string,
  stats: {
    yes_votes: number,
    no_votes: number,
    required_votes: number,
    averages: {
      fit: number,
      team: number,
      product: number,
      market: number,
    },
  },
  trello_id: string,
  trello_url: string,
};

type VotingStatusNotStarted = { status: 'not_started' };
type VotingStatusMissingUsers = {
  status: 'missing_users',
  users: Array<Partner>,
};
type VotingStatusComplete = { status: 'complete', funded: boolean };
export type VotingStatus =
  VotingStatusNotStarted | VotingStatusMissingUsers | VotingStatusComplete;
