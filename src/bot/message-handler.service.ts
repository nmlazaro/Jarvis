import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Events, Message } from 'discord.js';
import { DiscordClientService } from '../discord/discord-client.service';
import { CommandRegistryService } from './command-registry.service';
import { COMMAND_PREFIX } from 'src/music/cmds-const';

@Injectable()
export class MessageHandlerService implements OnModuleInit {
  private readonly logger = new Logger(MessageHandlerService.name);

  constructor(
    private readonly discord: DiscordClientService,
    private readonly registry: CommandRegistryService,
  ) {}

  private async handle(message: Message): Promise<void> {
    if (message.author.bot || !message.content.startsWith(COMMAND_PREFIX)) {
      return;
    }

    const args = message.content
      .slice(COMMAND_PREFIX.length)
      .trim()
      .split(/ +/);

    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = this.registry.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      this.logger.error(`Failed to execute the command: ERROR: ${error}`);
      await message.reply(`Failed to execute ${commandName}. ERROR: ${error}`);
    }
  }

  onModuleInit(): void {
    this.discord.client.on(Events.MessageCreate, (message) =>
      this.handle(message),
    );
  }
}
