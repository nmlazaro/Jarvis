import { Test } from '@nestjs/testing';
import { PlayerService } from '../../player.service';
import { StopCommand } from '../stop.command';

jest.mock('discord-player-youtubei', () => ({ YoutubeiExtractor: class {} }));

describe('StopCommand', () => {
  let command: StopCommand;
  let player: { getQueue: jest.Mock };

  const crearMensaje = (): any => ({
    guildId: 'guild-1',
    reply: jest.fn().mockResolvedValue(undefined),
  });

  beforeEach(async () => {
    player = { getQueue: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [StopCommand, { provide: PlayerService, useValue: player }],
    }).compile();

    command = moduleRef.get(StopCommand);
  });

  it('Se invoca el comando "stop"', () => {
    expect(command.name).toBe('stop');
  });

  it('No existe musica que detener', async () => {
    const message = crearMensaje();
    player.getQueue.mockReturnValue(null);

    await command.execute(message);

    expect(message.reply).toHaveBeenCalledWith('Nothing to stop...');
  });

  it('No hay nada en la cola para detener', async () => {
    const message = crearMensaje();
    player.getQueue.mockReturnValue({ isPlaying: () => false });

    await command.execute(message);

    expect(message.reply).toHaveBeenCalledWith('Nothing to stop...');
  });

  it('Borra la cola', async () => {
    const message = crearMensaje();
    const queue = { isPlaying: () => true, delete: jest.fn() };
    player.getQueue.mockReturnValue(queue);

    await command.execute(message);

    expect(queue.delete).toHaveBeenCalled();
  });
});
