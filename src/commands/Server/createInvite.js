const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');

class CreateInviteCommand extends Command {
  constructor() {
    super('createinvite', {
      aliases: ['createinvite', 'invite', 'inv'],
      ownerOnly: false,
      category: 'Server',
      channel: 'guild',
      cooldown: 10000,
      description: {
        description: 'Creates invite for the server and sends it.',
        usage: 'createinvite or inv',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    const checkPermsEmbed = new Discord.MessageEmbed().setDescription(
      "Apparently you can't create invite."
    );
    if (!message.member.hasPermission('CREATE_INSTANT_INVITE'))
      return message.channel.send(checkPermsEmbed);
    if (!message.guild.vanityURLCode)
      return message.channel.createInvite().then((invite) => {
        message.channel.send(`https://discord.gg/${invite.code}`);
        logChannel.send(
          new Discord.MessageEmbed({
            title: `New Server Invite Created [RNG]`,
            description: `${
              message.displayName
            } created an invite with the code: ${
              invite.code
            }\nCreated at: ${moment().format('LLLL')}`,
          })
        );
      });
    return message.channel.createInvite().then(() => {
      message.channel.send(`https://discord.gg/${message.guild.vanityURLCode}`);
      this.client.channels.cache.get(channels.modLogChannel).send(
        new Discord.MessageEmbed({
          color: 1638144,
          title: `New Server Invite Created [Vanity URL]`,
          description: `Created by: ${
            message.member.displayName
          }\nCreated at: ${moment().format('LLLL')}`,
        })
      );
    });
  }
}

module.exports = CreateInviteCommand;
