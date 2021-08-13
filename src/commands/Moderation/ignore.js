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
      userPermissions: 'MUTE_MEMBERS',
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
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please specify a member.`,
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
          this.client.channels.cache.get(channels.punishmentLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `DMs Ignored`,
              description: `**Offender**: ${args.member.user.tag}\n**Responsible Staff**: ${message.author.tag}`,
              footer: { text: `ID: ${args.member.id}` },
              timestamp: new Date(),
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member.user.tag}'s DMs are now ignored.`,
            })
          );
          args.member
            .send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: `Your DMs are now ignored by Eula bot, meaning you can not create tickets anymore until unignored.\n**Responsible Staff**: ${
                  message.author.tag ||
                  message.author.username ||
                  message.author
                }`,
              })
            )
            .catch((_) => {
              return;
            });
        });
    } else
      return await this.client.db.huTaoIgnoreList
        .findOneAndRemove({
          member_id: args.member,
        })
        .then(() => {
          this.client.channels.cache.get(channels.punishmentLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `DMs Unignored`,
              description: `**Offender**: ${args.member.user.tag}\n**Responsible Staff**: ${message.author.tag}`,
              footer: { text: `ID: ${args.member.id}` },
              timestamp: new Date(),
            })
          );
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.member.user.tag}'s DMs are not ignored anymore.`,
            })
          );
          args.member
            .send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: `Your DMs are not ignored by Eula bot anymore, meaning you can create tickets now.\n**Responsible Staff**: ${
                  message.author.tag ||
                  message.author.username ||
                  message.author
                }`,
              })
            )
            .catch((_) => {
              return;
            });
        });
  }
}

module.exports = IgnoreCommand;
