import { Injectable } from '@nestjs/common';
import { PlayerService } from '../player.service';
import { Message } from 'discord.js';
import { Command } from '../../bot/interfaces/command.interface';

@Injectable()
export class SkipCommand implements Command {
  readonly name = 'skip';
  readonly description = 'Skip to the next song';

  constructor(private readonly player: PlayerService) {}

  async execute(message: Message): Promise<void> {
    const queue = this.player.getQueue(message.guildId!);

    if (!queue || !queue.isPlaying()) {
      await message.reply('There is nothing to skip');
      return;
    }

    const currentTrack = queue.currentTrack;

    queue.node.skip();

    await message.reply(`Skipped: ${currentTrack?.title}`);
  }
}
