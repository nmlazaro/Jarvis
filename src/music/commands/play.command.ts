import { Injectable, Logger } from '@nestjs/common';
import { EmbedBuilder, Message } from 'discord.js';
import { Command } from '../../bot/interfaces/command.interface';
import { PlayerService } from '../player.service';

@Injectable()
export class PlayCommand implements Command {
  private readonly logger = new Logger(PlayCommand.name);

  readonly name = 'play';
  readonly description = 'Plays the requested song/audio';

  constructor(private readonly player: PlayerService) {}

  async execute(message: Message, args: string[]): Promise<void> {
    const channel = message.member?.voice.channel;
    if (!channel) {
      await message.reply('You are not on a channel!');
      return;
    }

    // Validates the search
    const query = args.join(' ');

    if (query.includes('${') || query.includes('process.env')) {
      // to prevent sqlinjection
      return;
    }

    if (!query) {
      await message.reply('Maybe you should type something to play...');
      return;
    }

    const searchMsg = await message.reply(`Looking for -> **${query}**...`);

    try {
      const { track } = await this.player.play(channel, query, {
        channel: message.channel,
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Added to the queue',
          iconURL: message.member?.user.displayAvatarURL(),
        })
        .setDescription(`**[${track.title}](${track.url})**`)
        .setThumbnail(track.thumbnail)
        .addFields(
          { name: 'Artist', value: track.author, inline: false },
          { name: 'Duration', value: track.duration, inline: false },
          { name: 'Source', value: track.source, inline: false },
        )
        .setFooter({ text: `Requested by ${track.requestedBy?.username}` })
        .setColor('#ffe600');

      await searchMsg.edit({ content: ' ', embeds: [embed] });
    } catch (error: any) {
      if (error.message.includes('No results found')) {
        await searchMsg.edit('No results found');
        return;
      }

      this.logger.error('Error al reproducir cancion:', error);
      await searchMsg.edit('An error ocurred trying to reproduce the song');
    }
  }
}
