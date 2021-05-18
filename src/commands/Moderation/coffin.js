const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class CoffinCommand extends Command {
  constructor() {
    super('coffin', {
      aliases: ['coffin'],
      category: 'Moderation',
      clientPermissions: ['MANAGE_ROLES'],
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
        description: 'Send a member to the coffin.',
        usage: 'coffin <user>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');

    const permRoles = [
      '810082837863858186', // Liyue Qixing
      '810550138552320010', // Wangshen Editor
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
            .setDescription(
              'Only <@&810550138552320010> members can send someone to the coffin.'
            )
            .setColor(16711680)
        );
    }

    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a user to update their roles.`,
        })
      );

    const coffinRole = global.guild.roles.cache.get('839680495453077534');
    const wangshengTcRole = global.guild.roles.cache.get('764838634280845312');
    const tcRole = global.guild.roles.cache.get('770962077199106098');
    const libSubmissionsRole =
      global.guild.roles.cache.get('804235956352712724');

    const removals = [wangshengTcRole, tcRole, libSubmissionsRole];

    if (!args.member.roles.cache.has(coffinRole.id)) {
      await args.member.roles.add(coffinRole.id).then(async () => {
        removals.forEach(
          async (role) => await args.member.roles.remove(role.id)
        );
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            title: `Send to Coffin`,
            fields: [
              { name: 'Member', value: args.member },
              { name: 'Responsible Staff', value: message.member },
              { name: 'Sent At', value: moment().format('LLLL') },
            ],
          })
        );
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Updated **${args.member}** and sent them to the coffin!`,
            footer: {
              text: `ID: ${args.member.id}`,
            },
          })
        );
      });
    } else
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `${args.member} is already in the coffin.`,
        })
      );
  }
}

// module.exports = CoffinCommand;
