const { Command } = require('discord-akairo');
const Discord = require('discord.js');

class ResetGambaTimerCommand extends Command {
  constructor() {
    super('moargamba', {
      aliases: ['moargamba', 'resetgambatimer'],
      ownerOnly: false,
      description: {
        description: 'Reset gamba cooldown globally.',
        usage: 'moargamba',
      },
    });
  }

  async exec(message) {
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

    const gambaCmd = this.client.commandHandler.findCommand('gamba');
    gambaCmd.cooldown = 0;
    await message.channel.send(
      new Discord.MessageEmbed({
        color: 'GREEN',
        description: `\`${gambaCmd}\` cooldown has been reset globally.`,
      })
    );
  }
}

// module.exports = ResetGambaTimerCommand;
