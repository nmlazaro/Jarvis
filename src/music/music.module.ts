import { Module } from '@nestjs/common';
import { DiscordModule } from '../discord/discord.module';
import { PlayerService } from './player.service';

@Module({
    imports: [DiscordModule],
    providers: [PlayerService],
    exports: [PlayerService]
})
export class MusicModule {}
