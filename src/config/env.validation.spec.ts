import { validate } from './env.validation';

describe('validate', () => {
  it('No existe DISCORD_TOKEN', () => {
    expect(() => validate({})).toThrow(/DISCORD_TOKEN/);
  });

  it('DISCORD_TOKEN esta vacio', () => {
    expect(() => validate({ DISCORD_TOKEN: '   ' })).toThrow(/DISCORD_TOKEN/);
  });

  it('DISCORD_TOKEN valido', () => {
    const test_token = { DISCORD_TOKEN: '1234' };
    expect(validate(test_token)).toEqual(test_token);
  });
});
