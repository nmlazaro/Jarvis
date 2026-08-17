import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { PlayerService } from './player.service';
import { PlayCommand } from './commands/play.command';
import { SkipCommand } from './commands/skip.command';
import { StopCommand } from './commands/stop.command';

@Module({
  imports: [DiscordModule],
  providers: [PlayerService, PlayCommand, SkipCommand, StopCommand],
  exports: [PlayerService],
})
export class MusicModule {}
