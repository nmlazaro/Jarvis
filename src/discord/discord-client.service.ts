import {Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordClientService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(DiscordClientService.name);

  readonly client: Client;

  constructor(private readonly config: ConfigService) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });
  }

  async onApplicationBootstrap(): Promise <void> {
    this.client.once(Events.ClientReady, (c) => this.logger.log(`Conectado como ${c.user.tag}`));

    await this.client.login(this.config.getOrThrow<string>('DISCORD_TOKEN'));
  }

  async onModuleDestroy(): Promise <void> {
    this.logger.log('Cerrando conexion con Discord');

    await this.client.destroy(); // Cierra el proceso con el enableShutdownHooks() de main.ts
  }
}