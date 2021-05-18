const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');

class GuildMemberAddListener extends Listener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
      category: 'Client',
    });
  }
  async exec(member) {
    this.client.channels.cache.get(channels.welcomeChannel).send(
      new Discord.MessageEmbed({
        title: `Welcome to ${member.guild.name}!`,
        description: `Welcome **${member.user.username}**, to Keqing Mains!\n\nLet's all be kind and respectful to one another :)`,
        fields: [
          {
            name: 'Rules and access to the server',
            value: `Read ${this.client.channels.cache.get(
              channels.getRolesHereChannel
            )} and react at the bottom to confirm and gain access to the server which will then allow you to grab roles in ${this.client.channels.cache.get(
              channels.reactRolesChannel
            )}`,
          },
          {
            name: "Don't know where to go?",
            value: `Talk to our receptionists at ${this.client.channels.cache.get(
              channels.welcomeIssuesChannel
            )}`,
          },
        ],
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        image: {
          url: 'https://media.discordapp.net/attachments/763589418086432778/813379829151301642/GI_-_KQM_2.png',
        },
      })
    );
  }
}

// module.exports = GuildMemberAddListener;
