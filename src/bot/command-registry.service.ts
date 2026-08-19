import { Inject, Injectable } from '@nestjs/common';
import { MUSIC_COMMANDS } from '../music/cmds-const';
import { Command } from './interfaces/command.interface';

@Injectable()
export class CommandRegistryService {
  private readonly commands = new Map<string, Command>();

  constructor(@Inject(MUSIC_COMMANDS) commands: Command[]) {
    for (const command of commands) {
      this.commands.set(command.name, command);
    }
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }
}
