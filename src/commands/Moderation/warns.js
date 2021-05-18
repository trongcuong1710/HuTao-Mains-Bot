const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');

class WarnsCommand extends Command {
  constructor() {
    super('warns', {
      aliases: ['warns'],
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
          id: 'warnID',
          type: 'string',
        },
      ],
      description: {
        description: 'Shows list of warnings of a member.',
        usage: 'warns <member> / warns <member> <warn ID>',
      },
    });
  }
  async showMemberWarnings(message, args, prefix, warns) {
    return await message.channel.send(
      new Discord.MessageEmbed({
        color: 'GREEN',
        description: warns.map((x) => `Warn ID: ${x.warnID}`).join('\n'),
        fields: [
          {
            name: 'View',
            value: `${prefix}warns ${args.member} <warnID>`,
            inline: true,
          },
          {
            name: 'Remove',
            value: `${prefix}removewarn ${args.member} <warnID>`,
            inline: true,
          },
        ],
      })
    );
  }
  async showWarnOfID(message, args) {
    await this.client.db.huTaoWarns
      .find({
        warnID: args.warnID,
      })
      .then(async (w) => {
        return await message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `k!removewarns ${args.member} ${w.map(
              (x) => x.warnID
            )} to remove a warning.`,
            fields: [
              {
                name: 'Warn ID',
                value: w.map((x) => x.warnID),
                inline: true,
              },
              {
                name: 'Moderator',
                value: w.map((x) => x.warnedStaff),
                inline: true,
              },
              {
                name: 'Reason',
                value: w.map((x) => x.reason).join('\n'),
                inline: false,
              },
              {
                name: 'Warned At',
                value: w.map((x) => moment(x.when).format('LLLL')),
                inline: true,
              },
              {
                name: `Remove`,
                value: `${this.client.commandHandler.prefix}removewarn ${
                  args.member
                } ${w.map((x) => x.warnID)}`,
                inline: true,
              },
            ],
          })
        );
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
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `Please supply a member to view their warnings.`,
        })
      );
    const prefix = this.client.commandHandler.prefix;
    const warns = await this.client.db.huTaoWarns.find({
      warnedMember: args.member,
    });
    if (!warns.length)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} has no warnings, yet.`,
        })
      );

    if (!args.warnID)
      return await this.showMemberWarnings(message, args, prefix, warns);

    await this.showWarnOfID(message, args);
  }
}

module.exports = WarnsCommand;
