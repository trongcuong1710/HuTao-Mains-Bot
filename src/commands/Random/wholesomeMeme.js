const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class WholesomeMemeCommand extends Command {
  constructor() {
    super('wholesome', {
      aliases: ['wholesome'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a wholesome image/gif.',
        usage: 'wholesome',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.wholesome());
  }
}

module.exports = WholesomeMemeCommand;
