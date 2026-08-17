import { Test } from '@nestjs/testing';
import { DiscordClientService } from '../discord/discord-client.service';
import { PlayerService } from './player.service';

jest.mock('discord-player-youtubei', () => ({ YoutubeiExtractor: class {} }));

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: DiscordClientService,
          useValue: {
            client: {
              on: jest.fn(),
              once: jest.fn(),
              incrementMaxListeners: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(PlayerService);
  });

  it('getQueue envia a player.nodes.get', () => {
    const queue = { id: 'q1' };
    service['player'].nodes.get = jest.fn().mockReturnValue(queue);

    expect(service.getQueue('guild-1')).toBe(queue);
    expect(service['player'].nodes.get).toHaveBeenCalledWith('guild-1');
  });

  it('Play pasa el metadata a nodeOptions', async () => {
    const result = { track: { title: 'any song' } };
    service['player'].play = jest.fn().mockResolvedValue(result);

    const channel = { id: 'channelA' } as any;
    const metadata = { channel: 'abc' };

    await service.play(channel, 'consulta', metadata);

    expect(service['player'].play).toHaveBeenCalledWith(channel, 'consulta', {
      nodeOptions: { metadata },
    });
  });
});
