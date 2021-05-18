const { Command } = require('discord-akairo');
const Discord = require('discord.js');
class PurgeCommand extends Command {
  constructor() {
    super('purge', {
      aliases: ['purge', 'clear'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: ['MANAGE_MESSAGES'],
      description: {
        description: 'Purges the given amount of messages.',
        usage: 'purge <1-100>',
      },
      args: [
        {
          id: 'amount',
          type: 'number',
        },
      ],
    });
  }

  async exec(message, args) {
    const permRoles = [
      '830700055539089457', // Admin
      '830700055539089456', // Mods
      '831001258806345728', // 76th Funeral Director (Zyla)
    ];
    var i;
    for (i = 0; i <= permRoles.length; i++) {
      if (
        message.member.roles.cache
          .map((x) => x.id)
          .filter((x) => permRoles.includes(x)).length === 0
      )
        return message.channel.send(
          new Discord.MessageEmbed()
            .setColor(16711680)
            .setDescription("You can't do that with the permissions you have.")
        );
    }
    if (!args.amount)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Pleace specify an amount!`,
        })
      );

    message.delete();

    await message.channel.bulkDelete(args.amount).catch((e) => {
      message.channel.send(e.message);
    });

    message.channel
      .send(
        new Discord.MessageEmbed({
          color: 65322,
          description: `Purged ${args.amount} messages.`,
        })
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  }
}

module.exports = PurgeCommand;
