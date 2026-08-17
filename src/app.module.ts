import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DiscordModule } from './discord/discord.module';
import { MusicModule } from './music/music.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate }),
    DiscordModule,
    MusicModule
  ],
})
export class AppModule {}