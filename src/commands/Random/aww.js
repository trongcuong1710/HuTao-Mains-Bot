const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class AwwCommand extends Command {
  constructor() {
    super('aww', {
      aliases: ['aww'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends an aww moment image/gif.',
        usage: 'aww',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.aww());
  }
}

module.exports = AwwCommand;
