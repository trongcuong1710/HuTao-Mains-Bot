const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const moment = require('moment');

class ChannelDeleteListener extends Listener {
  constructor() {
    super('channelDelete', {
      emitter: 'client',
      event: 'channelDelete',
      category: 'Client',
    });
  }

  async exec(channel) {
    const modMails = await this.client.db.huTaoModmail.findOne({
      channel_id: channel.id,
    });
    if (!modMails) return;

    const member = global.guild.members.cache.get(modMails.member_id);

    const fetchExecutor = await global.guild
      .fetchAuditLogs({ type: 'CHANNEL_DELETE' })
      .then((logs) =>
        logs.entries.find((entry) => entry.target.id == channel.id)
      )
      .then((entry) => {
        return entry.executor.id;
      });

    const responsibleStaff = global.guild.members.cache.get(fetchExecutor);

    await this.client.db.huTaoModmail
      .deleteOne({ channel_id: channel.id })
      .then(() => {
        global.guild.channels.cache.get(channels.dbLogsChannel).send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `A ticket channel was deleted, so I deleted the ticket info from database.`,
            fields: [
              { name: 'Ticket Author', value: member },
              { name: 'Responsible Staff', value: responsibleStaff },
              { name: 'Deleted At', value: moment().format('LLLL') },
            ],
          })
        );
      });
  }
}

module.exports = ChannelDeleteListener;
