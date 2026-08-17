import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DiscordClientService } from './discord-client.service';

describe('DiscordClientService', () => {
  let service: DiscordClientService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DiscordClientService,
        {
          provide: ConfigService,
          useValue: { getOrThrow: () => 'token-falso' },
        },
      ],
    }).compile();

    service = moduleRef.get(DiscordClientService);
  });

  it('Error al conecta el constructor', () => {
    expect(service.client.isReady()).toBe(false);
  });

  it('Login en onApplicationBootstrap con el token de config', async () => {
    // Arrange
    const login = jest
      .spyOn(service.client, 'login')
      .mockResolvedValue('token-falso');

    //Act
    await service.onApplicationBootstrap();

    //Assert
    expect(login).toHaveBeenCalledWith('token-falso');
  });

  it('destruye el cliente en onModuleDestroy', async () => {
    const destroy = jest.spyOn(service.client, 'destroy').mockResolvedValue();

    await service.onModuleDestroy();

    expect(destroy).toHaveBeenCalledWith();
  });
});
