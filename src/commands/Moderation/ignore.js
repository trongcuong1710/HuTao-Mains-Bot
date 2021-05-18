const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class IgnoreCommand extends Command {
  constructor() {
    super('ignore', {
      aliases: ['ignore'],
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
      ],
      description: {
        description: 'Ignores incoming DMs from given member.',
        usage: 'ignore <member>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
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
          description: `Please supply a member to ignore.`,
        })
      );
    if (
      !(await this.client.db.huTaoIgnoreList.findOne({
        member_id: args.member,
      }))
    ) {
      await this.client.db.huTaoIgnoreList
        .create({
          member_id: args.member,
          ignoredBy: message.author,
        })
        .then(() => {
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Member Ignored`,
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
                  name: 'Ignored At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 458496,
              description: `${args.member}'s DMs are now ignored.`,
            })
          );
        });
    } else
      return await this.client.db.huTaoIgnoreList
        .findOneAndRemove({
          member_id: args.member,
        })
        .then(() => {
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Member Unignored`,
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
                  name: 'Unignored At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member}'s DMs are not ignored anymore.`,
            })
          );
        });
  }
}

module.exports = IgnoreCommand;
