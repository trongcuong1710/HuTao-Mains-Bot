const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class WarnCommand extends Command {
  constructor() {
    super('warn', {
      aliases: ['warn', 'w'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
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
        description: 'Warn a member.',
        usage: 'warn <member> <reason>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    const prefix = this.client.commandHandler.prefix;
    if (!args.member)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
        })
      );
    if (args.member.id === message.member.id)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't warn yourself!`,
        })
      );
    if (args.member === message.guild.me)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't warn me!`,
        })
      );
    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `You can't warn someone with an equal or higher role!`,
        })
      );

    let reason = args.reason;
    if (!args.reason)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: `Please specify a reason.`,
        })
      );

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
          new MessageEmbed({
            color: 'RED',
            description: "You can't do that with the permissions you have.",
          })
        );
    }

    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    moment.locale('en');
    await this.client.db.huTaoWarns
      .create({
        warnID: getRandomIntInclusive(1, 10000),
        warnedMember: args.member,
        warnedStaff: message.author,
        reason: reason,
        when: moment().format('LLLL'),
      })
      .then(async (c) => {
        await message.channel
          .send(
            new MessageEmbed({
              color: 'GREEN',
              description: `${args.member.user.tag} has now been warned.`,
              fields: [
                {
                  name: `View`,
                  value: `${this.client.commandHandler.prefix}warns ${args.member} ${c.warnID}`,
                },
                {
                  name: `Remove`,
                  value: `${this.client.commandHandler.prefix}removewarn ${args.member} ${c.warnID}`,
                },
              ],
            })
          )
          .then(async () => {
            await this.client.channels.cache
              .get(channels.punishmentLogsChannel)
              .send(
                new MessageEmbed({
                  color: 'GREEN',
                  title: `Warned`,
                  description: `**Offender**: ${args.member.user.tag}\n**Responsible Staff**: ${message.author.tag}\n**Reason**: ${reason}`,
                  footer: { text: `ID: ${args.member.id}` },
                  timestamp: new Date(),
                })
              );
          });
        args.member
          .send(
            new MessageEmbed({
              color: 'RED',
              title: `You have been warned in ${global.guild.name}.`,
              description: `**Responsible Staff**: ${
                message.author.tag || message.author.username || message.author
              }\n**Reason**: ${reason}`,
              timestamp: new Date(),
            })
          )
          .catch((_) => {
            return;
          });
      });
  }
}

module.exports = WarnCommand;
