import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { VoiceBasedChannel } from 'discord.js';
import { GuildQueue, Player, Track } from 'discord-player';
import { EmbedBuilder } from 'discord.js';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import { DiscordClientService } from '../discord/discord-client.service';

@Injectable()
export class PlayerService implements OnModuleInit {
  private readonly logger = new Logger(PlayerService.name);
  private readonly player: Player;

  constructor(discord: DiscordClientService) {
    this.player = new Player(discord.client as any);
  }

  play(
    channel: VoiceBasedChannel,
    query: string,
    metadata: unknown,
  ): Promise<{ track: Track }> {
    return this.player.play(channel as any, query, {
      nodeOptions: { metadata },
    });
  }

  getQueue(guildId: string): GuildQueue | null {
    return this.player.nodes.get(guildId);
  }

  private registerEvents(): void {
    this.player.events.on('playerStart', (_queue, track) => {
      new EmbedBuilder()
        .setTitle('Playing now')
        .setDescription(`**${track.title}**`)
        .setImage(track.thumbnail)
        .addFields(
          { name: 'Artist', value: track.author, inline: false },
          { name: 'From', value: track.source, inline: false },
        )
        .setFooter({ text: `Requested by ${track.requestedBy?.username}` })
        .setColor('#0099ff');
    });

    this.player.events.on('error', (_queue, error) => {
      this.logger.error(`[Error de Queue] ${error.message}`);
    });

    this.player.events.on('playerError', (queue, error) => {
      this.logger.error(`AUDIO ERROR: ${error.message}`);
      this.logger.error(`Failed to reproduce: ${queue.currentTrack?.title}`);
      if (error.stack) this.logger.error(error.stack);
    });

    this.player.events.on('debug', (_queue, message) => {
      if (message.includes('extractor') || message.includes('pipe')) {
        this.logger.debug(message);
      }
    });
  }

  async onModuleInit(): Promise<void> {
    await this.player.extractors.register(YoutubeiExtractor, {
      streamOptions: { useClient: 'WEB' },
    });

    await this.player.extractors.loadMulti(DefaultExtractors);

    this.logger.log('Extractors cargados');
    this.registerEvents();
  }
}
