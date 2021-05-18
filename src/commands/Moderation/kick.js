const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class KickCommand extends Command {
  constructor() {
    super('kick', {
      aliases: ['kick', 'k'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: 'KICK_MEMBERS',
      args: [
        {
          id: 'member',
          type: (message, phrase) => {
            return this.client.util.resolveMember(
              phrase,
              message.guild.members.cache,
              false,
              true
            );
          },
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Kicks the member.',
        usage: 'kick <member> <reason>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `I couldn't find the user.`,
        })
      );

    if (args.member.id === message.member.id)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't kick yourself!`,
        })
      );

    if (args.member === message.guild.me)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't kick me!`,
        })
      );

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't warn someone with an equal or higher role!`,
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

    await args.member.kick(args.reason).then(async () => {
      message.channel.send(
        new Discord.MessageEmbed({
          color: 'GREEN',
          description: `Successful kick!`,
          fields: [
            { name: 'Member', value: args.member },
            { name: 'Reason', value: args.reason },
          ],
        })
      );
      this.client.channels.cache.get(channels.modLogChannel).send(
        new Discord.MessageEmbed({
          color: 'RED',
          title: `Kick`,
          fields: [
            {
              name: 'Member',
              value: args.member,
            },
            {
              name: 'Responsible Staff',
              value: message.member,
            },
            {
              name: 'Reason',
              value: args.reason,
            },
            {
              name: 'Kicked At',
              value: moment().format('LLLL'),
            },
          ],
          thumbnail: {
            url: args.member.user.displayAvatarURL({
              dynamic: true,
            }),
          },
        })
      );
      args.member
        .send(
          new Discord.MessageEmbed({
            color: 16711680,
            title: `You've been kicked from ${message.guild.name}`,
            fields: [
              {
                name: 'Responsible Staff',
                value: message.member,
              },
              { name: 'Reason', value: args.reason },
              { name: 'Kicked At', value: moment().format('LLLL') },
            ],
            footer: {
              text: `If you think you're wrongfully kicked, please contact an Admin.`,
            },
          })
        )
        .catch((e) => {
          return;
        });
    });
  }
}

module.exports = KickCommand;
