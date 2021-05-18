const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class WelcomeCommand extends Command {
  constructor() {
    super('welcome', {
      aliases: ['welcome'],
      category: 'Moderation',
      clientPermissions: ['MANAGE_ROLES'],
      cooldown: 5000,
      args: [
        { id: 'package', type: 'string', match: 'phrase' },
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
        description: 'no more manually assigning roles painfully! -Cola.',
        usage: 'welcome <package> <user>',
      },
    });
  }

  async exec(message, args) {
    const permRoles = [
      '810082837863858186', // Liyue Qixing
      '810558258619219979', // Wangshu Receptionist
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
              'Only <@&810558258619219979> members can assign packages.'
            )
            .setColor(16711680)
        );
    }

    const fullPackage = [
      '763583891440533524',
      '781339578350829582',
      '813470083690397766',
      '779971681266827294',
      '784321049579225119',
      '770962077199106098',
      '784315116559532072',
      '784314963686457354',
      '764018404348264458',
      '812181503382519828',
      '839821951820365845',
    ];

    const selectivePackage = [
      '763583891440533524',
      '781339578350829582',
      '784321049579225119',
      '770962077199106098',
      '784315116559532072',
      '784314963686457354',
      '764018404348264458',
      '839821951820365845',
    ];

    const casualPackage = [
      '763583891440533524',
      '781339578350829582',
      '813470083690397766',
      '779971681266827294',
      '784321049579225119',
      '764018404348264458',
      '812181503382519828',
      '839821951820365845',
    ];

    const seriousPackage = [
      '763583891440533524',
      '781339578350829582',
      '770962077199106098',
      '784315116559532072',
      '784314963686457354',
      '839821951820365845',
    ];

    switch (args.package) {
      case 'full':
        fullPackage.forEach(async (role) =>
          args.member ? await args.member.roles.add(role) : undefined
        );
        break;
      case 'selective':
        selectivePackage.forEach(async (role) =>
          args.member ? await args.member.roles.add(role) : undefined
        );
        break;
      case 'casual':
        casualPackage.forEach(async (role) =>
          args.member ? await args.member.roles.add(role) : undefined
        );
        break;
      case 'serious':
        seriousPackage.forEach(async (role) => {
          args.member ? await args.member.roles.add(role) : undefined;
        });
        break;
      default:
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Which package did you want to add?`,
            fields: [
              {
                name: 'Packages',
                value: `Full\nSelective\nCasual\nSerious`,
              },
            ],
          })
        );
    }
    if (!args.member)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'RED',
          description: `Please supply a user to add their roles.`,
        })
      );

    return message.channel.send(
      new Discord.MessageEmbed({
        color: 'PURPLE',
        description: `Successfully assigned \`${args.package}\` to ${args.member}.`,
      })
    );
  }
}

// module.exports = WelcomeCommand;
