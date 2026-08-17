// Require the necessary discord.js classes
import 'dotenv/config';
import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
} from 'discord.js';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Command } from './interfaces/Command.js';

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const player = new Player(client as any);

const loadExtractors = async () => {
  await player.extractors.register(YoutubeiExtractor, {
    streamOptions: {
      useClient: 'WEB',
    },
  });

  await player.extractors.loadMulti(DefaultExtractors);
  console.log('Extractors loaded');
};

loadExtractors();

player.events.on('playerStart', (queue, track) => {
  // @ts-ignore
  const embed = new EmbedBuilder()
    .setTitle('🎶 Reproduciendo Ahora')
    .setDescription(`**${track.title}**`)
    .setImage(track.thumbnail)
    .addFields(
      { name: 'Artista', value: track.author, inline: false },
      { name: 'Fuente', value: track.source, inline: false },
    )
    .setFooter({ text: `Pedido por ${track.requestedBy?.username}` })
    .setColor('#0099ff');
});

player.events.on('error', (queue, error) => {
  console.log(`[Error de Cola] ${error.message}`);
});

player.events.on('playerError', (queue, error) => {
  console.log(`AUDIO ERROR: ${error.message}`);
  console.log(`Failed to reproduce: ${queue.currentTrack?.title}`);
  console.log(`Cause: ${error.message}`);
  if (error.stack) console.log(error.stack);
});

player.events.on('debug', (queue, message) => {
  if (message.includes('extractor') || message.includes('pipe')) {
    console.log(`[DEBUG] ${message}`);
  }
});

// @ts-ignore
client.commands = new Collection();

(async () => {
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);

    const command: Command = commandModule.default;

    if ('name' in command && 'execute' in command) {
      // @ts-ignore
      client.commands.set(command.name, command);
    }
  }
})();

client.once(Events.ClientReady, (c) => {
  console.log('Client ready!');
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith('j:')) return;

  const args = message.content.slice(2).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  // @ts-ignore
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply(
      '❌ Hubo un error al ejecutar el comando.\n Proba "j:play URL o nombre de la cancion deseada".',
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
