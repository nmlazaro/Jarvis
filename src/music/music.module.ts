import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { PlayerService } from './player.service';
import { PlayCommand } from './commands/play.command';
import { SkipCommand } from './commands/skip.command';
import { StopCommand } from './commands/stop.command';
import { Command } from '../bot/interfaces/command.interface';
import { MUSIC_COMMANDS } from './cmds-const';

@Module({
  imports: [DiscordModule],
  providers: [
    PlayerService,
    PlayCommand,
    SkipCommand,
    StopCommand,
    {
      provide: MUSIC_COMMANDS,
      useFactory: (...commands: Command[]) => commands,
      inject: [PlayCommand, StopCommand, SkipCommand],
    },
  ],
  exports: [PlayerService, MUSIC_COMMANDS],
})
export class MusicModule {}
