const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class PollCommand extends Command {
  constructor() {
    super('poll', {
      aliases: ['poll'],
      description: { description: 'Create a poll.', usage: 'poll <question>' },
      ownerOnly: false,
      category: 'Moderation',
      args: [{ id: 'question', type: 'string', match: 'rest' }],
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
          new MessageEmbed()
            .setDescription("You can't do that with the permissions you have.")
            .setColor(16711680)
        );
    }

    if (!args.question)
      return message.channel.send(
        new MessageEmbed({
          color: 'RED',
          description: 'You wanna make a poll on nothing?',
        })
      );

    message.channel
      .send(
        new MessageEmbed({
          description: `**${message.author.username}** asks:\n${args.question}`,
        })
      )
      .then(async (m) => {
        await m.react('834966613191032912');
        await m.react('834966614516301894');
      });
  }
}

module.exports = PollCommand;
