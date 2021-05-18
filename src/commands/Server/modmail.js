const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const moment = require('moment');
const channels = require('../../Constants/channels.json');
const roles = require('../../Constants/roles.json');

class ModmailCommand extends Command {
  constructor() {
    super('ticket', {
      aliases: ['ticket'],
      ownerOnly: false,
      category: 'Server',
      channel: 'dm',
      description: {
        description: 'Contact the KQM Admins.',
        usage: 'ticket',
      },
    });
  }

  async exec(message) {
    moment.locale('en');
    const fetchedMember = await this.client.db.huTaoIgnoreList.findOne({
      member_id: message.author.id,
    });
    if (fetchedMember) return;
    if (
      !(await this.client.db.huTaoModmail.findOne({
        member_id: message.author.id,
      }))
    ) {
      await this.client.db.huTaoModmail
        .create({
          member_id: message.author.id,
        })
        .then(() => {
          message.author.send(
            new Discord.MessageEmbed({
              color: 'GREEN',
              title: `Ticket Created!`,
              description: `Please only use this if you have a question ONLY the administrators are able to answer and not for in-game Genshin questions.`,
              fields: [
                {
                  name: 'Images',
                  value: `You can send image links and it will be shown to staff as usual.`,
                },
                {
                  name: 'Attachments',
                  value: `You can send image attachments only and it will be shown to staff as usual. However if you don't say anything with the attachment your image attachment won't be shown.`,
                },
              ],
              footer: {
                text: `Please wait for the staff to close the ticket.`,
              },
            })
          );
          global.guild.channels
            .create(`${message.author.username}-ticket`, {
              reason: `New ticket created by ${message.author.username}`,
              nsfw: true,
              type: 'text',
              parent: roles.modMailParentRole,
              permissionOverwrites: [
                {
                  id: roles.adminRole, // Liyue Qixing
                  allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                },
                {
                  id: '763583452762734592', // everyone
                  deny: ['VIEW_CHANNEL'],
                },
                {
                  id: roles.muteRole, // muted
                  deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
                },
              ],
            })
            .then(async (c) => {
              const fetchedUser = await this.client.db.huTaoModmail.findOne({
                member_id: message.author.id,
              });
              const channel = global.guild.channels.cache.get(c.id);
              const user = this.client.users.cache.get(fetchedUser.member_id);
              const dmcFilter = (m) => m.content;
              const dmCollector =
                user.dmChannel.createMessageCollector(dmcFilter);
              const ticketChannelFilter = (m) => m.content;
              const channelCollector =
                channel.createMessageCollector(ticketChannelFilter);
              const filter = { member_id: message.author.id };
              const update = { channel_id: c.id };
              await this.client.db.huTaoModmail.findOneAndUpdate(
                filter,
                update
              );
              const admins = global.guild.roles.cache.get('810082837863858186');
              channel.send(
                `${admins}`,
                new Discord.MessageEmbed({
                  color: 'GREEN',
                  title: `${user.username}-${user.id} created a ticket!`,
                })
              );
              channelCollector.on('collect', async (m) => {
                if (m.author.bot) return;
                if (m.content == 'close ticket') {
                  try {
                    m.delete();
                    await this.client.db.huTaoModmail
                      .findOneAndRemove({
                        member_id: user.id,
                      })
                      .then(async () => {
                        await channel.delete().then(() => {
                          user
                            .send(
                              new Discord.MessageEmbed({
                                color: 'RED',
                                title: `Thread is now closed`,
                                description: `Thank you for contacting the KQM Admins. We hope we've addressed your query!`,
                                timestamp: moment().format('LLLL'),
                              })
                            )
                            .catch((e) => {
                              return;
                            });
                          channelCollector.stop();
                          dmCollector.stop();
                        });
                      });
                  } catch (_) {
                    return;
                  }
                  return;
                }

                let attachmentRegex =
                  /([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))/g;
                if (m.attachments.size > 0) {
                  if (
                    m.attachments.every((attachment) => {
                      const isImage = attachmentRegex.exec(attachment.name);
                      return isImage;
                    })
                  )
                    return user
                      .send(
                        new Discord.MessageEmbed({
                          color: 'GREEN',
                          title: `${m.author.username} said:`,
                          description: `${m.content}`,
                          image: {
                            url: m.attachments.array()[0].attachment,
                          },
                        })
                      )
                      .catch((e) => {
                        return;
                      });
                }

                var imgRegex =
                  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
                const isIncludingLink = imgRegex.exec(m.content);

                if (isIncludingLink)
                  return user
                    .send(
                      new Discord.MessageEmbed({
                        color: 'GREEN',
                        title: `${m.author.username} said:`,
                        description: `${m.content.replace(
                          isIncludingLink[0],
                          ' '
                        )}`,
                        image: { url: isIncludingLink[0] },
                      })
                    )
                    .catch((e) => {
                      return;
                    });
                user
                  .send(
                    new Discord.MessageEmbed({
                      color: 'GREEN',
                      title: `${m.author.username} said:`,
                      description: `${m.content}`,
                    })
                  )
                  .catch((e) => {
                    return;
                  });
              });

              dmCollector.on('collect', (m) => {
                if (m.author.bot) return;

                let attachmentRegex =
                  /([0-9a-zA-Z\._-]+.(png|PNG|gif|GIF|jp[e]?g|JP[E]?G))/g;
                if (m.attachments.size > 0) {
                  if (
                    m.attachments.every((attachment) => {
                      const isImage = attachmentRegex.exec(attachment.name);
                      return isImage;
                    })
                  )
                    return channel.send(
                      new Discord.MessageEmbed({
                        color: 'GREEN',
                        title: `${m.author.username} said:`,
                        description: `${m.content}`,
                        image: {
                          url: m.attachments.array()[0].attachment,
                        },
                      })
                    );
                }

                var imgRegex =
                  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
                const isIncludingLink = imgRegex.exec(m.content);

                if (isIncludingLink)
                  return channel.send(
                    new Discord.MessageEmbed({
                      color: 'GREEN',
                      title: `${m.author.username} said:`,
                      description: `${m.content.replace(
                        isIncludingLink[0],
                        ' '
                      )}`,
                      image: { url: isIncludingLink[0] },
                    })
                  );

                channel.send(
                  new Discord.MessageEmbed({
                    color: 'GREEN',
                    title: `${m.author.username} said:`,
                    description: `${m.content}`,
                  })
                );
              });
              const channelPromise = new Promise((resolve) =>
                channelCollector.once('end', resolve)
              );
              const dmPromise = new Promise((resolve) =>
                dmCollector.once('end', resolve)
              );
              const channelCollection = await channelPromise;
              const dmCollection = await dmPromise;
              const merged = channelCollection.concat(dmCollection);
              merged.sort(
                (channelContent, dmContent) =>
                  channelContent.createdTimestamp - dmContent.createdTimestamp
              );
              const logs = merged
                .map((x) => `${x.author.username}: ${x.content}`)
                .join('\n');
              const modMailLogsChannel = guild.channels.cache.get(
                channels.modMailLogsChannel
              );
              modMailLogsChannel.send(
                `Thread for ${user.username} is closed, read below for logs.`,
                new Discord.MessageAttachment(
                  Buffer.from(logs),
                  `${user.username}-logs.txt`
                )
              );
            });
        });
    } else {
      return;
    }
  }
}

module.exports = ModmailCommand;
