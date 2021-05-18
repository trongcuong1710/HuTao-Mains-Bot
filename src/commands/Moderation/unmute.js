const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const roles = require('../../Constants/roles.json');

class UnmuteCommand extends Command {
  constructor() {
    super('unmute', {
      aliases: ['unmute'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      clientPermissions: ['MUTE_MEMBERS'],
      description: {
        description: 'Unmute a member.',
        usage: 'unmute <member>',
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
    const muteRole = message.guild.roles.cache.get(roles.muteRole);

    if (!args.member) {
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `I couldn't find the user.`,
        })
      );
    }

    if (args.member.roles.cache.has(muteRole.id)) {
      await args.member.roles.remove(muteRole).then(async () => {
        await this.client.db.huTaoMutes.deleteOne({
          member_id: args.member.id,
        });
        await message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `${args.member} has now been unmuted.`,
          })
        );
        await this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            title: `Member Unmuted (Command Unmute)`,
            description: `${args.member} has been unmuted.`,
          })
        );
        await args.member
          .send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `You have been unmuted in **${global.guild.name}**`,
            })
          )
          .catch(async (e) => {
            return;
          });
      });
    } else {
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} is not muted.`,
        })
      );
    }
  }
}

module.exports = UnmuteCommand;
