const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class CatCommand extends Command {
  constructor() {
    super('cat', {
      aliases: ['cat', 'meow'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a cat image/gif.',
        usage: 'cat',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.cat());
  }
}

module.exports = CatCommand;
