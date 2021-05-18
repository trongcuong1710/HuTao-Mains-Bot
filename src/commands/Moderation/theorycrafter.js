const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class TheoryCrafterCommand extends Command {
  constructor() {
    super('theorycrafter', {
      aliases: ['theorycrafter', 'tc'],
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
        description: 'Adds/removes Theorycrafter from the specified member.',
        usage: 'theorycrafter <user>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');

    const permRoles = [
      '810082837863858186', // Liyue Qixing
      '810550138552320010', // Wangshen Editor
      '810550298174554152', // Wangshen Intern
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
              'Only <@&810550138552320010> and <@&810550298174554152> members can add Theorycrafter.'
            )
            .setColor(16711680)
        );
    }

    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a user to add Theorycrafter.`,
        })
      );

    const tcRole = global.guild.roles.cache.get('764838634280845312');
    if (!args.member.roles.cache.has(tcRole.id)) {
      await args.member.roles.add(tcRole.id).then(() => {
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            title: `Theorycraft`,
            fields: [
              { name: 'Member', value: args.member },
              { name: 'Responsible Staff', value: message.member },
              { name: 'Added At', value: moment().format('LLLL') },
            ],
          })
        );
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Added **${tcRole.name}** to **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${tcRole.id}`,
            },
          })
        );
      });
    } else {
      return await args.member.roles.remove(tcRole.id).then(() => {
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            title: `Theorycraft`,
            fields: [
              { name: 'Member', value: args.member },
              { name: 'Responsible Staff', value: message.member },
              { name: 'Removed At', value: moment().format('LLLL') },
            ],
          })
        );
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Removed **${tcRole.name}** from **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${tcRole.id}`,
            },
          })
        );
      });
    }
  }
}

// module.exports = TheoryCrafterCommand;
