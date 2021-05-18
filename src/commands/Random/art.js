const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class ArtCommand extends Command {
  constructor() {
    super('art', {
      aliases: ['art'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends an art image/gif.',
        usage: 'art',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.art());
  }
}

module.exports = ArtCommand;
