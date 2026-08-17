import { Test } from '@nestjs/testing';
import { PlayerService } from '../../player.service';
import { PlayCommand } from '../play.command';

// Igual que en player.service.spec.ts con esto se evita que Jest cargue youtubei.js
jest.mock('discord-player-youtubei', () => ({ YoutubeiExtractor: class {} }));

describe('PlayCommand', () => {
  let command: PlayCommand;
  let player: { play: jest.Mock };
  let searchMsg: { edit: jest.Mock };

  const crearMensaje = (conCanalDeVoz = true): any => {
    searchMsg = { edit: jest.fn() };
    return {
      member: {
        voice: { channel: conCanalDeVoz ? { id: 'canal-voz' } : null },
        user: { displayAvatarURL: () => 'http://avatar' },
      },
      channel: { id: 'canal-texto' },
      reply: jest.fn().mockResolvedValue(searchMsg),
    };
  };

  beforeEach(async () => {
    player = { play: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      providers: [PlayCommand, { provide: PlayerService, useValue: player }],
    }).compile();

    command = moduleRef.get(PlayCommand);
  });

  it('funcion de "play"', () => {
    expect(command.name).toBe('play');
  });

  it('rechaza si el usuario no está en un canal de voz', async () => {
    const message = crearMensaje(false);

    await command.execute(message, ['una', 'canción']);

    expect(message.reply).toHaveBeenCalledWith('You are not on a channel!');
    expect(player.play).not.toHaveBeenCalled();
  });

  it('rechaza intentos de inyección sin responder nada', async () => {
    const message = crearMensaje();

    await command.execute(message, ['${process.env.DISCORD_TOKEN}']);

    expect(player.play).not.toHaveBeenCalled();
    expect(message.reply).not.toHaveBeenCalled();
  });

  it('rechaza una busquedas vacias', async () => {
    const message = crearMensaje();

    await command.execute(message, []);

    expect(message.reply).toHaveBeenCalledWith(
      'Maybe you should type something to play...',
    );
    expect(player.play).not.toHaveBeenCalled();
  });

  it('reproduce y edita el mensaje con el embed', async () => {
    const message = crearMensaje();
    player.play.mockResolvedValue({
      track: {
        title: 'Bohemian Rhapsody',
        url: 'http://track',
        thumbnail: 'http://thumb',
        author: 'Queen',
        duration: '5:55',
        source: 'youtube',
        requestedBy: { username: 'nico' },
      },
    });

    await command.execute(message, ['bohemian', 'rhapsody']);

    expect(message.reply).toHaveBeenCalledWith(
      'Looking for -> **bohemian rhapsody**...',
    );
    expect(player.play).toHaveBeenCalledWith(
      { id: 'canal-voz' },
      'bohemian rhapsody',
      { channel: { id: 'canal-texto' } },
    );
    expect(searchMsg.edit).toHaveBeenCalledWith(
      expect.objectContaining({ embeds: expect.any(Array) }),
    );
  });

  it('avisa cuando no hay resultados', async () => {
    const message = crearMensaje();
    player.play.mockRejectedValue(new Error('No results found for query'));

    await command.execute(message, ['asdkjhaskdjh']);

    expect(searchMsg.edit).toHaveBeenCalledWith('No results found');
  });
});
