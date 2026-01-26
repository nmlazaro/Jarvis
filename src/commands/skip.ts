import type { Message } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import type { Command } from '../interfaces/Command.js';

const skipCommand: Command = {
    name: 'skip',
    description: 'Pasa a la siguiente cancion',
    async execute(message: Message, args: string[]) {
        const player = useMainPlayer();
        
        const queue = player.nodes.get(message.guildId!);

        if (!queue || !queue.isPlaying()) {
            await message.reply('❌ No hay nada sonando para saltar.');
            return;
        }

        const currentTrack = queue.currentTrack;

        queue.node.skip();

        await message.reply(`⏭️ **Saltada:** ${currentTrack?.title}`);
    }
};

export default skipCommand;