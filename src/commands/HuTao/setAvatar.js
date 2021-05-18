const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class SetAvatarCommand extends Command {
  constructor() {
    super('setavatar', {
      aliases: ['setavatar', 'sa'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'avatarURL',
          type: 'string',
        },
      ],
      description: {
        description: "Change Hu Tao's avatar.",
        usage: 'setavatar <url>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.avatarURL)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `Please supply an URL to change my pfp.`,
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

    await this.client.user.setAvatar(args.avatarURL).then(() => {
      message.channel
        .send(
          new Discord.MessageEmbed({
            color: 1638144,
            description: 'My new avatar is now:',
            image: {
              url: args.avatarURL,
            },
          })
        )
        .then(() => {
          this.client.channels.cache.get(channels.modLogChannel).send(
            new Discord.MessageEmbed({
              color: 1638144,
              title: `My Avatar Changed`,
              description: `New avatar:\nChanged at: ${moment().format(
                'LLLL'
              )}`,
              image: { url: args.avatarURL },
            })
          );
        });
    });
  }
}

module.exports = SetAvatarCommand;
