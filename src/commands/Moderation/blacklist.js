const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class BlacklistCommand extends Command {
  constructor() {
    super('blacklist', {
      aliases: ['blacklist', 'bl'],
      category: 'Moderation',
      channel: 'guild',
      args: [
        {
          id: 'channel',
          type: (message, phrase) => {
            return this.client.util.resolveChannel(
              phrase,
              message.guild.channels.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Disables/Enables huTao in a given channel.',
        usage: 'blacklist <channel>',
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
    if (!args.channel)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `Please supply a channel to blacklist/unblacklist.`,
        })
      );
    if (
      !(await this.client.db.huTaoBlacklists.findOne({
        channel_id: args.channel,
      }))
    ) {
      await this.client.db.huTaoBlacklists
        .create({
          channel_id: args.channel,
          blacklistedBy: message.author,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is now blacklisted.`,
              footer: { text: `Use the command again to unblacklist.` },
            })
          );
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Channel Blacklist`,
              fields: [
                {
                  name: 'Channel',
                  value: args.channel,
                },
                {
                  name: 'Responsible Staff',
                  value: message.member,
                },
                {
                  name: 'Blacklisted At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
        });
    } else
      return await this.client.db.huTaoBlacklists
        .findOneAndRemove({
          channel_id: args.channel,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `${args.channel} is not blacklisted anymore.`,
              footer: { text: `Use the command again to blacklist.` },
            })
          );
          this.client.channels.cache.get(channels.dbLogsChannel).send(
            new Discord.MessageEmbed({
              color: 'RED',
              title: `Channel Unblacklist`,
              fields: [
                {
                  name: 'Channel',
                  value: args.channel,
                },
                {
                  name: 'Responsible Staff',
                  value: message.member,
                },
                {
                  name: 'Unblacklisted At',
                  value: moment().format('LLLL'),
                },
              ],
            })
          );
        });
  }
}

module.exports = BlacklistCommand;
