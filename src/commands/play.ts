import type { Message } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import type { Command } from '../interfaces/Command.js';

const playCommand: Command = {
    name: 'play',
    description: 'Reproduce música de Spotify o SoundCloud',
    async execute(message: Message, args: string[]) {
        const player = useMainPlayer(); 

        // Validate voice channel
        const channel = message.member?.voice.channel;
        if (!channel) {
            await message.reply('❌ No estas conectado.');
            return;
        }

        // Validates the search
        const query = args.join(' ');

        if (query.includes('${') || query.includes('process.env')) {
            await message.reply('Buen intento...');
            return;
        }

        if (!query) {
            await message.reply('❌ Escribí el nombre de la canción o pega el link.');
            return;
        }

        const searchMsg = await message.reply(`🔍 Buscando **${query}**...`);

        try {
            const { track } = await player.play(channel as any, query, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel
                    }
                }
            });

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Añadido a la Cola', iconURL: message.member?.user.displayAvatarURL() })
                .setDescription(`**[${track.title}](${track.url})**`)
                .setThumbnail(track.thumbnail)
                .addFields(
                    { name: '👤 Artista', value: track.author, inline: false },
                    { name: '⏳ Duración', value: track.duration, inline: false },
                    { name: 'SOURCE', value: track.source, inline: false }
                )
                .setFooter({ text: `Pedido por ${track.requestedBy?.username}` })
                .setColor('#ffe600');

            await searchMsg.edit({ content: ' ', embeds: [embed] })
            
        } catch (error: any) {
            if (error.message.includes('No results found')) {
                await searchMsg.edit('❌ No encontré esa canción.');
                return; 
            }

            console.error('Error al reproducir:', error);
            await searchMsg.edit('❌ Hubo un error inesperado al intentar reproducir.');
        }
    }
};

export default playCommand;