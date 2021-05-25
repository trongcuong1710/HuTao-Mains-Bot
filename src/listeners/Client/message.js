const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class MessageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
      category: 'Client',
    });
  }
  async exec(message) {
    const fetchedMember = await this.client.db.huTaoIgnoreList.findOne({
      member_id: message.author.id,
    });

    if (message.author.bot) return;
    // if (message.author.id !== this.client.ownerID) return;

    const modMails = await this.client.db.huTaoModmail.find();
    if (!modMails) return;
    modMails.forEach(async (x) => {
      const member = global.guild.members.cache.get(x.member_id);
      const channel = global.guild.channels.cache.get(x.channel_id);

      if (
        message.channel.id === channel.id &&
        message.content === 'close ticket'
      ) {
        await global.guild.channels.cache.get(channels.dbLogsChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `A ticket channel was deleted, so I deleted the ticket info from database.`,
            fields: [
              {
                name: 'Ticket Author',
                value: `${member}-(${member.id})`,
              },
              {
                name: 'Deleted At',
                value: moment().format('LLLL'),
              },
            ],
          })
        );

        await channel.delete().catch((e) => {
          global.guild.channels.cache
            .get(channels.consoleLogsChannel)
            .send(
              process.env.BOT_OWNER,
              new Discord.MessageAttachment(Buffer.from(e.stack), 'error.txt')
            );
        });
      }
    });

    if (message.guild === null) {
      if (fetchedMember) return;
      if (message.content === 'k!ticket') return;
      if (
        await this.client.db.huTaoModmail.findOne({
          member_id: message.author.id,
        })
      )
        return;
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'PURPLE',
          description: `Oh! It seems like somebody slid into my DMs 😊\nIf you have a problem that needs an admin's attention, please message me again using the command \`k!ticket\` in order to open up a direct ticket with the administrators.`,
        })
      );
    }

    if (
      await this.client.db.huTaoBlacklists.findOne({
        channel_id: message.channel,
      })
    )
      return;

    const prefix = this.client.commandHandler.prefix;

    //if (message.author.id !== this.client.ownerID) return;
    let quoteName = '';
    const firstWord = message.content.trim().split(/ +/g)[0];
    if (firstWord.startsWith(prefix)) {
      quoteName = firstWord.slice(prefix.length);
    }

    const huTaoQuotes = await this.client.db.huTaoQuotes.findOne({
      quoteName: quoteName,
    });

    if (!huTaoQuotes) return;
    // if (huTaoQuotes)
    //   return message.channel.send(
    //     huTaoQuotes.embed
    //       ? new Discord.MessageEmbed(JSON.parse(huTaoQuotes.quote))
    //       : huTaoQuotes.quote
    //   );

    if (huTaoQuotes.embed)
      return message.channel.send(
        new Discord.MessageEmbed(JSON.parse(huTaoQuotes.quote))
      );

    // const target = global.guild.members.cache.get(
    //   message.mentions.users.first().id
    // );

    if (huTaoQuotes.quote.includes('{mention}'))
      // return message.channel.send(
      //   huTaoQuotes.quote.replace(
      //     '{mention}',
      //     global.guild.members.cache.get(message.mentions.users.first())
      //       .username
      //   )
      // );
      return message.channel.send(
        message.mentions.users.first()
          ? huTaoQuotes.quote.replace(
              '{mention}',
              global.guild.members.cache.get(message.mentions.users.first().id)
                .user.username
            )
          : 'Mention sumone!!'
      );

    return message.channel.send(
      message.mentions.users.first() ? huTaoQuotes.quote : huTaoQuotes.quote
    );
  }
}

module.exports = MessageListener;
