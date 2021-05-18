const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class SetUsernameCommand extends Command {
  constructor() {
    super('setusername', {
      aliases: ['setusername', 'setname'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'newName',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: "Change Hu Tao's username.",
        usage: 'setusername newName',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    if (!args.newName)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 16711680,
          description: `Please supply a new name for me.`,
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

    await this.client.user.setUsername(args.newName).then(() => {
      message.channel
        .send(
          new Discord.MessageEmbed({
            color: 2424576,
            description: `My new username is now ${args.newName}!`,
          })
        )
        .then(() => {
          this.client.channels.cache.get(channels.modLogChannel).send(
            new Discord.MessageEmbed({
              color: 1638144,
              title: `My Username Changed`,
              description: `New username: ${
                args.newName
              }\nChanged at: ${moment().format('LLLL')}`,
            })
          );
        });
    });
  }
}

module.exports = SetUsernameCommand;
