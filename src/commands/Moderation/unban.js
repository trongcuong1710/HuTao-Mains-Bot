const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');
class UnbanCommand extends Command {
  constructor() {
    super('unban', {
      aliases: ['unban', 'ub'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: 'BAN_MEMBERS',
      args: [
        {
          id: 'user',
          type: 'string',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Unbans the member. **Use IDs Only**',
        usage: 'unban <user> <reason>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.user)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `Please supply a banned user to unban.`,
        })
      );
    if (!args.reason) args.reason = '`None Provided`';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

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

    await message.guild.fetchBans().then(async (bans) => {
      const user = bans.get(args.user);
      if (!user)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `They are not in ban list.`,
          })
        );
      await message.guild.members
        .unban(user.user, args.reason)
        .then(async () => {
          await message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `Successful unban.`,
              fields: [
                { name: 'User', value: user.user },
                { name: 'ID', value: user.user.id },
              ],
            })
          );
          await this.client.channels.cache.get(channels.modLogChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Unban`,
              fields: [
                { name: 'Member', value: user.user },
                { name: 'Reason', value: args.reason },
                { name: 'Responsible Staff', value: message.member },
                { name: 'Unbanned At', value: moment().format('LLLL') },
              ],
            })
          );
        });
    });
  }
}

module.exports = UnbanCommand;
