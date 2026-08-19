import { Module } from '@nestjs/common';
import { MusicModule } from '../music/music.module';
import { CommandRegistryService } from './command-registry.service';
import { MessageHandlerService } from './message-handler.service';
import { DiscordModule } from '../discord/discord.module';

@Module({
  imports: [MusicModule, DiscordModule],
  providers: [CommandRegistryService, MessageHandlerService],
})
export class BotModule {}
