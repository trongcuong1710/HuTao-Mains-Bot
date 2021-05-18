const { Command, AkairoClient } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const bot = require('../../../package.json');
const ms = require('ms');

class BotInfoCommand extends Command {
  constructor() {
    super('botinfo', {
      aliases: ['botinfo', 'binfo', 'bi'],
      ownerOnly: false,
      category: 'Information',
      description: {
        description: 'Shows bot information.',
        usage: 'botinfo',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    const botInfoEmbed = new Discord.MessageEmbed()
      .setColor(11038940)
      .setDescription(
        `Hello, I'm Hu Tao, nice to meet you!\nI'm created just for Hu Tao Mains Discord Server.\nThough I don't have anything special about me to show you :/\n${
          this.client.users.cache.get(this.client.ownerID).username
        } is my creator, if there is anything I could do better please inform **__him__**!`
      )
      .setThumbnail(
        this.client.user.displayAvatarURL({ dynamic: true, size: 512 })
      )
      .addFields(
        { name: 'Project Version:', value: bot.version },
        { name: 'Programming Language Used:', value: 'JavaScript' },
        { name: 'Prefix:', value: this.client.commandHandler.prefix },
        // { name: 'Public Repository:', value: bot.homepage },
        { name: 'Ping:', value: `${Math.round(this.client.ws.ping)}` },
        {
          name: 'Uptime',
          value: ms(this.client.uptime, { long: true }),
        }
      );
    message.channel.send(botInfoEmbed);
  }
}

module.exports = BotInfoCommand;
