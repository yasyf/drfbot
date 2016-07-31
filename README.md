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
