export function validate(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const token = config.DISCORD_TOKEN;

  if (typeof token !== 'string' || token.trim() === '') {
    throw new Error('No existe DISCORD_TOKEN para conectarse a Discord');
  }

  return config;
}
