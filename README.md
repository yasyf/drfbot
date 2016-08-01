# DRFBot

A Slack bot for DRF!

## Interactions

The entire bot is based around the notion of Interactions. Define new ones in [`src/interactions/`](./src/interactions/) and extend [`BaseInteraction`](./src/interactions/base.js). Each interaction must define a array of patterns to listen for, an array of message types to act on, and a hook for responding. Types are below for reference.

```javascript
type MessageType = 'direct_message' | 'ambient' | 'direct_mention' | 'mention';
type MessageTypes = 'message_received' | Array<MessageType>;
type Pattern = string | RegExp;
type Patterns = Array<Pattern> | Immutable.List<Pattern>;
type AsyncPatterns = Patterns | Promise<Patterns>;
type Hook = (bot: SlackBot, message: Message) => void;

interface Interaction {
  patterns: AsyncPatterns;
  messageTypes: MessageTypes;
  hook: Hook;
}
```

## Current interactions

### [LadiesAndGentsInteraction](./src/interactions/ladies_and_gents.js)

@channel's everyone echoing whatever was said that contains the phrase "ladies and gentlemen".

Example: `Ladies and gents, I have an announcement!`

### [ClaimInteraction](./src/interactions/claim.js)

Allows a partner to claim a currently-unassigned company which has applied on the site and is waiting in Trello.

Example: `@drfbot claim TheNextGoogle`

### [CompanyMentionInteraction](./src/interactions/company_mention.js)

Broadcasts with a custom overview for any company that's mentioned.

Example: `I'm super excited about Xperii!`

### [PointPartnerQuestionInteraction](./src/interactions/point_partner_question.js)

Responds with an answer for any company whose point partners someone asks a question about.

Example: `Who is the point partner for BrainSpec?`

### [CompanyInteraction](./src/interactions/company_question.js)

Responds with a custom overview and Trello bot prompt for any company that is included in the query.

Example: `@drfbot company Spyce`
