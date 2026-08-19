import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate }), BotModule],
})
export class AppModule {}
