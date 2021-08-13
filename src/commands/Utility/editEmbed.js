const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class EditEmbedCommand extends Command {
  constructor() {
    super('editembed', {
      aliases: ['editembed', 'ee'],
      ownerOnly: false,
      category: 'Utility',
      channel: 'guild',
      args: [
        {
          id: 'messageID',
          type: 'guildMessage',
        },
        {
          id: 'newMessage',
          type: 'string',
          match: 'rest',
        },
      ],
      description: {
        description: 'Edits an embed.',
        usage: 'editembed <messageID> <new embed>',
      },
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
          new MessageEmbed().setDescription(
            "You can't do that with the permissions you have."
          )
        );
    }

    if (!args.messageID)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a message ID that is sent by **me**.`,
        })
      );
    if (!args.newMessage)
      return message.channel.send(
        new MessageEmbed({
          description: `You must provide a new embed to replace the old one.`,
        })
      );

    if (args.messageID.partial) {
      args.messageID
        .fetch()
        .then(async (fullMessage) => {
          await fullMessage
            .edit(new MessageEmbed(JSON.parse(args.newMessage)))
            .then(async () => {
              message.react('834139708736667680');
            });
        })
        .catch((error) => {
          message.channel.send(
            'Something went wrong when fetching the message: ',
            error
          );
        });
    } else {
      await args.messageID
        .edit(new MessageEmbed(JSON.parse(args.newMessage)))
        .then(async () => {
          message.react('834139708736667680');
        });
    }
  }
}

module.exports = EditEmbedCommand;
