import { Message } from 'discord.js';

export interface Command {
  readonly name: string;
  readonly description: string;
  execute(message: Message, args: string[]): Promise<void>;
}
