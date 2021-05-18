const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class IgnoreListCommand extends Command {
  constructor() {
    super('ignorelist', {
      aliases: ['ignorelist'],
      category: 'Moderation',
      channel: 'guild',
      description: {
        description: 'List ignored members.',
        usage: 'ignorelist',
      },
    });
  }

  async exec(message) {
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
            .setDescription("You can't do that with the permissions you have.")
            .setColor(16711680)
        );
    }
    const blacklists = await this.client.db.huTaoIgnoreList.find();

    if (!blacklists.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `There are no ignored members in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 65280,
        title: `List of Ignored Members`,
        description: blacklists
          .map(
            (x) =>
              `**Ignored Member:** ${x.member_id}\n**Ignored By**: ${message.author}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = IgnoreListCommand;
