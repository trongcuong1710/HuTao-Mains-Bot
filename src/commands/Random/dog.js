const { Command } = require('discord-akairo');
const api = require('random-stuff-api');

class DogCommand extends Command {
  constructor() {
    super('dog', {
      aliases: ['dog', 'woof', 'rawr'],
      channel: 'guild',
      cooldown: 30000,
      description: {
        description: 'Sends a dog image/gif.',
        usage: 'dog',
      },
    });
  }

  async exec(message) {
    await message.channel.send(await api.image.dog());
  }
}

module.exports = DogCommand;
