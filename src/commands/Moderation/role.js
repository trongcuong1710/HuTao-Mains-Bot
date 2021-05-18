const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class RoleCommand extends Command {
  constructor() {
    super('role', {
      aliases: ['role'],
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
        {
          id: 'role',
          type: (message, phrase) => {
            return this.client.util.resolveRole(
              phrase,
              message.guild.roles.cache,
              false,
              true
            );
          },
        },
      ],
      description: {
        description: 'Adds/removes a role from the specified member.',
        usage: 'role <user> <role>',
      },
    });
  }

  async exec(message, args) {
    moment.locale('en');
    function permCheck() {
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
                "You can't do that with the permissions you have."
              )
              .setColor(16711680)
          );
      }
    }
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a user to add a role.`,
        })
      );

    if (!args.role)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a role to add to the user.`,
        })
      );
    const permRoles = [
      '830700055539089457', // Admin
      '830700055539089456', // Mods
      '831001258806345728', // 76th Funeral Director (Zyla)
    ];
    permCheck();
    if (!args.member.roles.cache.has(args.role.id)) {
      await args.member.roles.add(args.role.id).then(() => {
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            title: `Add Role`,
            fields: [
              { name: 'Member', value: args.member },
              { name: 'Role', value: args.role },
              { name: 'Role ID', value: args.role.id },
              { name: 'Responsible Staff', value: message.member },
              { name: 'Added At', value: moment().format('LLLL') },
            ],
          })
        );
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'GREEN',
            description: `Added **${args.role.name}** to **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${args.role.id}`,
            },
          })
        );
      });
    } else {
      return await args.member.roles.remove(args.role.id).then(() => {
        this.client.channels.cache.get(channels.modLogChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            title: `Removed Role`,
            fields: [
              { name: 'Member', value: args.member },
              { name: 'Role', value: args.role },
              { name: 'Role ID', value: args.role.id },
              { name: 'Responsible Staff', value: message.member },
              { name: 'Removed At', value: moment().format('LLLL') },
            ],
          })
        );
        message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Removed **${args.role.name}** from **${args.member}**!`,
            footer: {
              text: `ID: ${args.member.id} | Role ID: ${args.role.id}`,
            },
          })
        );
      });
    }
  }
}

module.exports = RoleCommand;
