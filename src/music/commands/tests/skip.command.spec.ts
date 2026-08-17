import { Test } from '@nestjs/testing';
import { PlayerService } from '../../player.service';
import { SkipCommand } from '../skip.command';

jest.mock('discord-player-youtubei', () => ({ YoutubeiExtractor: class {} }));

describe('SkipCommand', () => {
  let command: SkipCommand;
  let player: { getQueue: jest.Mock };

  const crearMensaje = (): any => ({
    guildId: 'guild-1',
    reply: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    player = { getQueue: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [SkipCommand, { provide: PlayerService, useValue: player }],
    }).compile();

    command = moduleRef.get(SkipCommand);
  });

  it('Se invoca al comando "skip"', () => {
    expect(command.name).toBe('skip');
  });

  it('Avisa que no exite nada en la cola', async () => {
    const message = crearMensaje();
    player.getQueue.mockReturnValue(null);

    await command.execute(message);

    expect(message.reply).toHaveBeenCalledWith('There is nothing to skip');
  });

  it('Avisa si la cola no está sonando', async () => {
    const message = crearMensaje();
    player.getQueue.mockReturnValue({ isPlaying: () => false });

    await command.execute(message);

    expect(message.reply).toHaveBeenCalledWith('There is nothing to skip');
  });

  it('Pasa a la siguiente cancion y muestra que se skipeo', async () => {
    const message = crearMensaje();
    const skip = jest.fn();
    player.getQueue.mockReturnValue({
      isPlaying: () => true,
      currentTrack: { title: 'Bohemian Rhapsody' },
      node: { skip },
    });

    await command.execute(message);

    expect(skip).toHaveBeenCalled();
    expect(message.reply).toHaveBeenCalledWith('Skipped: Bohemian Rhapsody');
  });
});
