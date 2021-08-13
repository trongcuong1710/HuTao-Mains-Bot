const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EmbedCommand extends Command {
  constructor() {
    super('embed', {
      aliases: ['embed'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      description: {
        description: 'Takes json input and returns embedded message.',
        usage: 'embed <JSON>',
      },
    });
  }

  async exec(message, args) {
    const roles = [
      '830700055539089457', // Admin
      '830700055539089456', // Mods
      '831001258806345728', // 76th Funeral Director (Zyla)
    ];
    var i;
    for (i = 0; i <= roles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => roles.includes(x)).length === 0
      )
        return await message.channel.send(
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    try {
      message.channel.send(
        new MessageEmbed(
          JSON.parse(message.content.split(' ').splice(1).join(' '))
        )
      );
    } catch (e) {
      await message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Improper input.`,
        })
      );
    }
  }
}

module.exports = EmbedCommand;
