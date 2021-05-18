const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class DeadInsideCommand extends Command {
  constructor() {
    super('deadinside', {
      aliases: ['deadinside'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a deadinside image/gif.',
        usage: 'deadinside',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.deadinside());
  }
}

module.exports = DeadInsideCommand;
