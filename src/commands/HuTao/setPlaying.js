const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class SetPlayingCommand extends Command {
  constructor() {
    super('setplaying', {
      aliases: ['setplaying', 'sp'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'newPlayingStatus',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: "Change Hu Tao's status, no input resets status.",
        usage: 'setplaying new status',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.newPlayingStatus) {
      return await this.client.user
        .setPresence({
          activity: { name: 'over my ghost.', type: 'WATCHING' },
          status: 'online',
          afk: false,
        })
        .then(async () => {
          message.channel.send(
            new Discord.MessageEmbed({
              description: `My status has been reset.`,
            })
          );
          this.client.channels.cache.get(channels.modLogChannel).send(
            new Discord.MessageEmbed({
              color: 1638144,
              title: `My Status Has Been Reset`,
              description: `Reset At: ${moment().format('LLLL')}`,
            })
          );
        });
    }

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

    await this.client.user
      .setPresence({
        activity: {
          name: args.newPlayingStatus,
          type: 'PLAYING',
        },
      })
      .then(() => {
        message.channel
          .send(
            new Discord.MessageEmbed({
              color: 2424576,
              description: 'New status is set.',
            })
          )
          .then(() => {
            global.guild.channels.cache.get(channels.modLogChannel).send(
              new Discord.MessageEmbed({
                color: 1638144,
                title: `My Status Changed`,
                description: `New status: ${
                  args.newPlayingStatus
                }\nChanged At: ${moment().format('LLLL')}`,
              })
            );
          });
      });
  }
}

module.exports = SetPlayingCommand;
