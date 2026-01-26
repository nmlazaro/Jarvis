import type { Message } from 'discord.js';
import { useMainPlayer } from 'discord-player';
import type { Command } from '../interfaces/Command.js';

const stopCommand: Command = {
    name: 'stop',
    description: 'Detiene la música y desconecta al bot',
    async execute(message: Message, args: string[]) {
        const player = useMainPlayer();

        const queue = player.nodes.get(message.guildId!);

        if (!queue || !queue.isPlaying()) {
            await message.reply('❌ No hay música sonando para detener.');
            return;
        }

        queue.delete();

        await message.reply('👍 Chau! ');
    }
};

export default stopCommand;