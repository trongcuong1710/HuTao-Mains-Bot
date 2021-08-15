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
    if (message.author.bot) return;

    // if (message.author.id != this.client.ownerID) return;

    const prefix = this.client.commandHandler.prefix;

    const fetchedMember = await this.client.db.huTaoIgnoreList.findOne({
      member_id: message.author.id,
    });

    const hasTicket = await this.client.db.huTaoModmail.findOne({
      member_id: message.author.id,
    });

    if (
      await this.client.db.huTaoBlacklists.findOne({
        channel_id: message.channel,
      })
    )
      return;

    if (message.guild === null) {
      if (hasTicket) return;
      if (fetchedMember) return;
      if (message.content == '.ticket') return;
      if (
        await this.client.db.huTaoModmail.findOne({
          member_id: message.author.id,
        })
      )
        return;
    }
    //? Modmail
    //#region Modmail
    const modMails = await this.client.db.huTaoModmail.find();
    if (!modMails) return;

    modMails.forEach(async (x) => {
      const member = global.guild.members.cache.get(x.member_id);
      const channel = global.guild.channels.cache.get(x.channel_id);
      const modMailLogsChannel = guild.channels.cache.get(
        channels.modMailLogsChannel
      );

      if (
        message.channel.id === channel.id &&
        message.content === 'close ticket'
      ) {
        await this.client.db.huTaoModmail.deleteOne({
          member_id: member.id,
        });

        await channel.messages.fetch().then(async (messages) => {
          const logs = messages
            .filter((m) => m.author.id != '836765323553144862')
            .sort(
              (user, admin) => user.createdTimestamp - admin.createdTimestamp
            )
            .map((x) => `${x.author.username}: ${x.content}`)
            .join('\n');

          modMailLogsChannel.send(
            `Ticket for ${message.author.username} is closed, read below for logs.`,
            new Discord.MessageAttachment(
              Buffer.from(logs),
              `${message.author.username}-logs.txt`
            )
          );
        });

        await channel.delete().catch((e) => {
          global.guild.channels.cache
            .get(channels.errorLogsChannel)
            .send(
              process.env.BOT_OWNER,
              new Discord.MessageAttachment(Buffer.from(e.stack), 'error.txt')
            );
        });
      }
    });
    //#endregion

    //? Quote System
    //#region Quote System
    let quoteName = '';
    const firstWord = message.content.trim().split(/ +/g)[0];
    if (firstWord.startsWith(prefix)) {
      quoteName = firstWord.slice(prefix.length);
    }

    const huTaoQuotes = await this.client.db.huTaoQuotes.findOne({
      quoteName: quoteName,
    });

    if (!huTaoQuotes) return;

    if (huTaoQuotes.embed)
      return message.channel.send(
        new Discord.MessageEmbed(JSON.parse(huTaoQuotes.quote))
      );

    if (huTaoQuotes.quote.includes('{mention}'))
      return message.channel.send(
        message.mentions.users.first()
          ? huTaoQuotes.quote.replace(
              '{mention}',
              global.guild.members.cache.get(message.mentions.users.first().id)
                .user.username
            )
          : 'Mention someone, baka!!'
      );

    return message.channel.send(
      message.mentions.users.first() ? huTaoQuotes.quote : huTaoQuotes.quote
    );
    //#endregion
  }
}

module.exports = MessageListener;
