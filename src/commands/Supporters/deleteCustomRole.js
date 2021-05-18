const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class DeleteCustomRoleCommand extends Command {
  constructor() {
    super('deletecustomrole', {
      aliases: ['deletecustomrole', 'dcr', 'delcusrole'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      description: {
        description:
          'Create a custom role for yourself if you are a patreon booster.',
        usage: 'myrole <role name>',
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
        {
          id: 'reason',
          type: 'string',
          match: 'text',
        },
      ],
    });
  }

  async exec(message, args) {
    const permRoles = [
      '810082837863858186', // Liyue Qixing
      '810410368622395392', // KEQING'S KEY
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
          color: 'RED',
          description: `Please provide a member.`,
        })
      );
    else if (!args.reason)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please provide a reason.`,
        })
      );

    const customRoles = await this.client.db.keqingCustomRoles.find({
      roleOwner: args.member.id,
    });
    const role = message.guild.roles.cache.get(
      customRoles.map((x) => x.roleID).join('\n')
    );
    await this.client.db.keqingCustomRoles
      .deleteOne({ roleID: role.id })
      .then(async () => {
        if (!role) return;

        role.delete(args.reason).then(async (deleted) => {
          await message.channel.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              description: `Successfully deleted the role!`,
            })
          );
        });
      });
  }
}

// module.exports = DeleteCustomRoleCommand;
