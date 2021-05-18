const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class MemeCommand extends Command {
  constructor() {
    super('meme', {
      aliases: ['meme'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a meme image/gif.',
        usage: 'meme',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.meme());
  }
}

module.exports = MemeCommand;
