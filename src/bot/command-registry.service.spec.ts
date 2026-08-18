import { Test } from '@nestjs/testing';
import { MUSIC_COMMANDS } from '../music/constants';
import { Command } from './interfaces/command.interface';
import { CommandRegistryService } from './command-registry.service';

describe('CommandRegistryService', () => {
  const falso = (name: string): Command => ({
    name,
    description: '',
    execute: jest.fn(),
  });

  const crearRegistry = async (commands: Command[]) => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CommandRegistryService,
        { provide: MUSIC_COMMANDS, useValue: commands },
      ],
    }).compile();

    return moduleRef.get(CommandRegistryService);
  };

  it('Encuentra un comando por nombre', async () => {
    const play = falso('play');
    const registry = await crearRegistry([play, falso('stop')]);

    expect(registry.get('play')).toBe(play);
  });

  it('Devolver undefined para un comando inexistente', async () => {
    const registry = await crearRegistry([falso('play')]);

    expect(registry.get('inexistente')).toBeUndefined();
  });

  it('Funcionar sin command', async () => {
    const registry = await crearRegistry([]);

    expect(registry.get('play')).toBeUndefined();
  });
});
