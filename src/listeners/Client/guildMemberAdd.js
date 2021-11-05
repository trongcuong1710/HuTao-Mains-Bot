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
    const prefix = this.client.commandHandler.prefix;
    this.client.channels.cache.get(channels.welcomeChannel).send(
      new Discord.MessageEmbed({
        title: `Welcome to ${member.guild.name}!`,
        description: `Welcome **${member.user.username}**!\n\nLet's all be kind and respectful to one another :)`,
        fields: [
          {
            name: 'Rules and access to the server',
            value: `In order to get access to the server, <@876446722329563176> will verify and give you access to the server via DMs as well as send you a copy of the rules which can also be found in <#830700055811588138>. 
            **Please make sure your DMs are open**, then start the verification process by DMing **${prefix}verify** to <@876446722329563176>.`,
          },
          // {
          //   name: "Don't know where to go?",
          //   value: `Talk to our receptionists at ${this.client.channels.cache.get(
          //     channels.welcomeIssuesChannel
          //   )}`,
          // },
        ],
        thumbnail: member.user.displayAvatarURL({ dynamic: true }),
        // image: {
        //   url: 'https://media.discordapp.net/attachments/763589418086432778/813379829151301642/GI_-_KQM_2.png',
        // },
      })
    );
  }
}

// module.exports = GuildMemberAddListener;
