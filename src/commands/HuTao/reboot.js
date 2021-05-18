const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class RebootCommand extends Command {
  constructor() {
    super('reboot', {
      aliases: ['reboot'],
      description: { description: 'Reboots the bot.', usage: 'reboot' },
      ownerOnly: false,
      category: 'Keqing',
    });
  }

  async exec(message) {
    const permRoles = [
      '830700055539089457', // Admin
      // '830700055539089456', // Mods
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

    await message.channel
      .send(
        new MessageEmbed({
          color: 'PURPLE',
          description: `I'll be right back!`,
        })
      )
      .then(async () => {
        await console.log(`Rebooted.`);
        await process.exit(0);
      });
  }
}

module.exports = RebootCommand;
