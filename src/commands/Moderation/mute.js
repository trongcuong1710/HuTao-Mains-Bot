const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const roles = require('../../Constants/roles.json');
const channels = require('../../Constants/channels.json');
const ms = require('ms');
const moment = require('moment');
const prettyMilliseconds = require('pretty-ms');

class MuteCommand extends Command {
  constructor() {
    super('mute', {
      aliases: ['mute'],
      clientPermissions: ['MUTE_MEMBERS'],
      description: {
        description: 'Mute a member.',
        usage: 'mute <user> <duration> <reason>',
      },
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
          id: 'duration',
          type: 'string',
          match: 'phrase',
        },
        {
          id: 'reason',
          type: 'string',
          match: 'rest',
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
            .setDescription("You can't do that with the permissions you have.")
            .setColor(16711680)
        );
    }
    moment.locale('en');
    const muteRole = message.guild.roles.cache.get(roles.muteRole);

    if (!args.member) {
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `I couldn't find the user.`,
        })
      );
    }
    if (args.member.id === message.member.id)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence yourself!`,
        })
      );
    if (args.member === message.guild.me)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence me!`,
        })
      );

    if (
      args.member.roles.highest.position >=
      message.member.roles.highest.position
    )
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You can't silence someone with an equal or higher role!`,
        })
      );

    if (!args.duration) {
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please enter a length of time of 14 days or less.`,
        })
      );
    }

    let duration = ms(args.duration);
    if (!duration || duration > 1209600000)
      // Cap at 14 days, larger than 24.8 days causes integer overflow
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: 'Please enter a length of time of 14 days or less.',
        })
      );

    if (!args.reason) args.reason = '`None Provided`';
    if (args.reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (args.member.roles.cache.has(muteRole))
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} is already muted.`,
        })
      );

    await args.member.roles.add(muteRole).then(async () => {
      await this.client.db.huTaoMutes.create({
        member_id: args.member.id,
        unmuteDate: Date.now() + duration,
      });
      message.channel.send(
        new Discord.MessageEmbed({
          color: 'GREEN',
          description: `Successful mute!`,
          fields: [
            { name: 'Member', value: args.member },
            {
              name: 'Duration',
              value: prettyMilliseconds(duration, { verbose: true }),
            },
          ],
        })
      );
      args.member.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `You have now been muted in ${global.guild.name}.`,
          fields: [
            { name: `Moderator`, value: message.member, inline: true },
            {
              name: `Duration`,
              value: `\`${prettyMilliseconds(duration, {
                verbose: true,
              })}\``,
              inline: true,
            },
            { name: `Reason`, value: args.reason, inline: true },
            {
              name: `Muted At`,
              value: moment().format('LLLL'),
              inline: true,
            },
          ],
        })
      );
      this.client.channels.cache.get(channels.modLogChannel).send(
        new Discord.MessageEmbed({
          color: 'RED',
          title: `Member Muted`,
          description: `${
            args.member
          } has now been muted for **${prettyMilliseconds(duration, {
            verbose: true,
          })}**.`,
          fields: [
            { name: `Moderator`, value: message.member, inline: true },
            { name: `Member`, value: args.member, inline: true },
            {
              name: `Duration`,
              value: `\`${prettyMilliseconds(duration, {
                verbose: true,
              })}\``,
              inline: true,
            },
            { name: `Reason`, value: args.reason, inline: true },
            {
              name: `Muted At`,
              value: moment().format('LLLL'),
              inline: true,
            },
          ],
        })
      );
    });

    args.member.timeout = message.client.setTimeout(async () => {
      if (args.member.roles.cache.has(muteRole.id)) {
        await args.member.roles.remove(muteRole).then(async () => {
          await this.client.db.huTaoMutes.deleteOne({
            member_id: args.member.id,
          });
          args.member.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `You have been unmuted in ${global.guild.name}`,
            })
          );
          this.client.channels.cache.get(channels.modLogChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Member Unmuted (Auto Unmute)`,
              description: `${args.member} has been unmuted.`,
            })
          );
        });
      }
      return;
    }, duration);
  }
}

module.exports = MuteCommand;
