const { Command } = require('discord-akairo');
const Discord = require('discord.js');
var moment = require('moment');
const channels = require('../../Constants/channels.json');

class RemoveWarnCommand extends Command {
  constructor() {
    super('removewarn', {
      aliases: ['removewarn', 'rw'],
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
        description: "Remove a member's warn.",
        usage: 'warn <member> <reason>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please provide a user to remove their warn.`,
        })
      );
    if (!args.warnID)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please provide a warnID to remove from ${args.member}'s warns.`,
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
          new Discord.MessageEmbed()
            .setDescription("You can't do that with the permissions you have.")
            .setColor(16711680)
        );
    }
    const warnReasonWas = await this.client.db.huTaoWarns.find({
      warnID: args.warnID,
    });
    await this.client.db.huTaoWarns
      .deleteOne({ warnID: args.warnID })
      .then(async (c) => {
        await message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Removed **${args.warnID}** from ${args.member}'s warns.`,
          })
        );
        await this.client.channels.cache
          .get(channels.modLogChannel)
          .send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Member Warn Removed`,
              description: `Removed ${args.warnID} from ${args.member.user.username}'s warns.`,
              fields: [
                { name: `Moderator`, value: message.member, inline: true },
                { name: `Member`, value: args.member, inline: true },
                {
                  name: `Warn Reason Was`,
                  value: warnReasonWas.map((x) => x.reason).join('\n'),
                  inline: false,
                },
                {
                  name: `Removed Warn At`,
                  value: moment().format('LLLL'),
                  inline: true,
                },
              ],
            })
          )
          .then(async (msg) => {
            await args.member
              .send(
                new Discord.MessageEmbed({
                  color: 'GREEN',
                  title: `Warn Removed`,
                  description: `One of your warns have been removed in ${message.guild.name}.`,
                  fields: [
                    {
                      name: `Moderator`,
                      value: message.member,
                      inline: true,
                    },
                    {
                      name: `Warn Reason Was`,
                      value: warnReasonWas.reason,
                      inline: false,
                    },
                    {
                      name: `Removed Warned At`,
                      value: moment().format('LLLL'),
                      inline: true,
                    },
                  ],
                })
              )
              .catch(async (e) => {
                return;
              });
          });
      });
  }
}

module.exports = RemoveWarnCommand;
