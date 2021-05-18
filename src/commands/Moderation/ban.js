const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BanCommand extends Command {
  constructor() {
    super('ban', {
      aliases: ['ban', 'b'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: 'BAN_MEMBERS',
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
        description: 'Ban the specified member.',
        usage: 'ban <user> <reason>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a member to ban.`,
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
    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Sorry but you can't ban other staff members/staff members that has higher perms than you.`,
        })
      );

    const banList = await message.guild.fetchBans();

    const bannedUser = banList.some((user) => user.id === args.member.id);

    if (bannedUser)
      return await message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${bannedUser} is already banned!`,
        })
      );
    else
      await args.member.ban({ reason: args.reason }).then(() => {
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Successful ban!`,
            fields: [
              { name: 'Member', value: args.member.displayName },
              { name: 'Reason', value: args.reason },
            ],
          })
        );
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            title: `Ban`,
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
                name: 'Banned At',
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
              title: `You've been banned from ${message.guild.name}`,
              fields: [
                { name: 'Responsible Staff', value: message.member },
                { name: 'Reason', value: args.reason },
                {
                  name: 'Banned At',
                  value: moment().format('LLLL'),
                },
              ],
              footer: {
                text: `If you think you're wrongfully banned, please contact an Admin.`,
              },
            })
          )
          .catch((e) => {
            return;
          });
      });
  }
}

module.exports = BanCommand;
