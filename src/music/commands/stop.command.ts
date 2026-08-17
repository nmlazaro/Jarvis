import { Injectable } from '@nestjs/common';
import { Message } from 'discord.js';
import { Command } from '../../bot/interfaces/command.interface';
import { PlayerService } from '../player.service';

@Injectable()
export class StopCommand implements Command {
  readonly name = 'stop';
  readonly description = 'Stops all the playlist/queue';

  constructor(private readonly player: PlayerService) {}

  async execute(message: Message): Promise<void> {
    const queue = this.player.getQueue(message.guildId!);

    if (!queue || !queue.isPlaying()) {
      await message.reply('Nothing to stop...');
      return;
    }

    queue.delete();

    await message.reply('Bye!');
  }
}
