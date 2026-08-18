import { Module } from '@nestjs/common';
import { MusicModule } from '../music/music.module';
import { CommandRegistryService } from './command-registry.service';

@Module({
  imports: [MusicModule],
  providers: [CommandRegistryService],
})
export class BotModule {}
