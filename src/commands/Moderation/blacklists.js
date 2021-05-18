const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class BlacklistsCommand extends Command {
  constructor() {
    super('blacklists', {
      aliases: ['blacklists', 'blist'],
      category: 'Moderation',
      channel: 'guild',
      description: {
        description: 'List blacklisted channels.',
        usage: 'blacklists',
      },
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
            .setDescription("You can't do that with the permissions you have.")
            .setColor(16711680)
        );
    }
    const blacklists = await this.client.db.huTaoBlacklists.find();
    if (!blacklists.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `There are no blacklisted channels in the database.`,
        })
      );
    message.channel.send(
      new Discord.MessageEmbed({
        color: 'c19bd2',
        title: `Blacklisted Channels`,
        description: blacklists
          .map(
            (x) =>
              `**Blacklisted Channel:** ${x.channel_id}\n**Blacklisted By:** ${x.blacklistedBy}`
          )
          .join('\n\n'),
      })
    );
  }
}

module.exports = BlacklistsCommand;
