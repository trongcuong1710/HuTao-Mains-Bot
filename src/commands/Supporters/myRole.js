const { Command } = require('discord-akairo');
const Discord = require('discord.js');
const roles = require('../../Constants/roles.json');

class MyRoleCommand extends Command {
  constructor() {
    super('myrole', {
      aliases: ['myrole'],
      ownerOnly: false,
      category: 'Moderation',
      channel: 'guild',
      description: {
        description:
          'Create a custom role for yourself if you are a patreon booster.',
        usage: 'myrole <role name>',
      },
      args: [
        {
          id: 'roleName',
          type: 'string',
          match: 'text',
        },
        {
          id: 'name',
          match: 'flag',
          flag: '--name',
        },
        {
          id: 'newName',
          type: 'string',
          match: 'text',
        },
        {
          id: 'color',
          match: 'flag',
          flag: '--color',
        },
        {
          id: 'newColor',
          type: 'string',
          match: 'text',
        },
        {
          id: 'colors',
          match: 'flag',
          flag: '--colors',
        },
      ],
    });
  }
  // check if server has the role
  // message.guild.roles.cache.some((r) => r.name.toLowerCase() === args.roleName.toLowerCase())

  async exec(message, args) {
    const prefix = this.client.commandHandler.prefix;
    const parentRole = '815211478202187777';
    const customRoles = await this.client.db.keqingCustomRoles.find({
      roleOwner: message.author.id,
    });
    const role = message.guild.roles.cache.get(
      customRoles.map((x) => x.roleID).join('\n')
    );

    if (args.name) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (!args.newName)
        return await role
          .setName(`${message.member.user.username}'s Custom Role`)
          .then((updated) =>
            message.channel.send(
              new Discord.MessageEmbed({
                color: role.color,
                description: `Your role name has been reset to ${updated.name}!`,
              })
            )
          );
      return await role
        .setName(args.newName)
        .then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: role.color,
              description: `Your role name has been updated!`,
              fields: [
                { name: 'Old Name', value: role.name, inline: true },
                { name: 'New Name', value: updated.name, inline: true },
              ],
            })
          )
        )
        .catch(
          async (e) =>
            await message.channel.send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: e.message,
              })
            )
        );
    }

    if (args.color) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (!args.newColor)
        return await role.setColor('000000').then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: updated.color,
              description: `Your role color has been reset to default!`,
            })
          )
        );
      return await role
        .setColor(args.newColor)
        .then((updated) =>
          message.channel.send(
            new Discord.MessageEmbed({
              color: updated.color,
              description: `Your role name has been updated!`,
              fields: [
                { name: 'Old Color', value: role.color, inline: true },
                { name: 'New Color', value: updated.color, inline: true },
              ],
            })
          )
        )
        .catch(
          async (e) =>
            await message.channel.send(
              new Discord.MessageEmbed({
                color: 'RED',
                description: e.message,
              })
            )
        );
    }

    if (args.colors)
      return message.channel.send(
        new Discord.MessageEmbed({
          color: 'PURPLE',
          description: `List of colors as strings you can use in \`k!myrole --color <new color>\``,
          fields: [
            {
              name: 'DEFAULT',
              value: `https://imagecolorpicker.com/color-code/000000`,
            },
            {
              name: 'WHITE',
              value: `https://imagecolorpicker.com/color-code/ffffff`,
            },
            {
              name: 'AQUA',
              value: 'https://imagecolorpicker.com/color-code/1abc9c',
            },
            {
              name: 'GREEN',
              value: `https://imagecolorpicker.com/color-code/2ecc71`,
            },
            {
              name: 'BLUE',
              value: `https://imagecolorpicker.com/color-code/3498db`,
            },
            {
              name: 'YELLOW',
              value: 'https://imagecolorpicker.com/color-code/ffff00',
            },
            {
              name: 'PURPLE',
              value: `https://imagecolorpicker.com/color-code/9b59b6`,
            },
            {
              name: 'LUMINOUS_VIVID_PINK',
              value: `https://imagecolorpicker.com/color-code/e91e63`,
            },
            {
              name: 'GOLD',
              value: 'https://imagecolorpicker.com/color-code/f1c40f',
            },
            {
              name: 'ORANGE',
              value: `https://imagecolorpicker.com/color-code/e67e22`,
            },
            {
              name: 'RED',
              value: `https://imagecolorpicker.com/color-code/e74c3c`,
            },
            {
              name: 'GREY',
              value: 'https://imagecolorpicker.com/color-code/95a5a6',
            },
            {
              name: 'DARKER_GREY',
              value: `https://imagecolorpicker.com/color-code/979c9f`,
            },
            {
              name: 'NAVY',
              value: `https://imagecolorpicker.com/color-code/34495e`,
            },
            {
              name: 'DARK_AQUA',
              value: 'https://imagecolorpicker.com/color-code/11806a',
            },
            {
              name: 'DARK_GREEN',
              value: `https://imagecolorpicker.com/color-code/1f8b4c`,
            },
            {
              name: 'DARK_BLUE',
              value: `https://imagecolorpicker.com/color-code/206694`,
            },
            {
              name: 'DARK_PURPLE',
              value: `https://imagecolorpicker.com/color-code/71368a`,
            },
            {
              name: 'DARK_VIVID_PINK',
              value: `https://imagecolorpicker.com/color-code/ad1457`,
            },
            {
              name: 'DARK_GOLD',
              value: 'https://imagecolorpicker.com/color-code/c27c0e',
            },
            {
              name: 'DARK_ORANGE',
              value: `https://imagecolorpicker.com/color-code/a84300`,
            },
            {
              name: 'DARK_RED',
              value: `https://imagecolorpicker.com/color-code/992d22`,
            },
            {
              name: 'DARK_GREY',
              value: 'https://imagecolorpicker.com/color-code/979c9f',
            },
            {
              name: 'LIGHT_GREY',
              value: `https://imagecolorpicker.com/color-code/bcc0c0`,
            },
            {
              name: 'DARK_NAVY',
              value: `https://imagecolorpicker.com/color-code/2c3e50`,
            },
            {
              name: 'BLURPLE',
              value: 'https://imagecolorpicker.com/color-code/7289da',
            },
            {
              name: 'GREYPLE',
              value: `https://imagecolorpicker.com/color-code/99aab5`,
            },
            {
              name: 'DARK_BUT_NOT_BLACK',
              value: `https://imagecolorpicker.com/color-code/2c2f33`,
            },
            {
              name: 'NOT_QUITE_BLACK',
              value: 'https://imagecolorpicker.com/color-code/23272a',
            },
          ],
        })
      );

    if (!args.roleName) {
      if (!role)
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `You don't have a custom role.`,
            fields: [
              {
                name: 'Make One!',
                value: `${prefix + this.id} <role name>`,
              },
            ],
          })
        );
      if (
        await this.client.db.keqingCustomRoles.findOne({
          roleOwner: message.member.id,
        })
      )
        return message.channel.send(
          new Discord.MessageEmbed({
            color: role.color,
            fields: [
              {
                name: `Your Role's Name`,
                value: `${role.name}`,
                inline: true,
              },
              {
                name: `Your Role's Color`,
                value: `${role.color}`,
                inline: true,
              },
              {
                name: 'Edit Your Role Name',
                value: `${prefix}myrole --name <new name>`,
              },
              {
                name: 'Edit Your Role Color',
                value: `${prefix}myrole --color <new color>`,
              },
            ],
          })
        );
    } else {
      if (message.member.roles.cache.has(roles.adeptusPatreon)) {
        if (
          !(await this.client.db.keqingCustomRoles.findOne({
            roleOwner: message.member.id,
          }))
        )
          await this.client.db.keqingCustomRoles
            .create({
              roleOwner: message.member.id,
            })
            .then(async (res) => {
              await message.guild.roles
                .create({
                  data: {
                    name: args.roleName,
                    color: 0,
                    hoist: false,
                    position: parentRole.position,
                    mentionable: false,
                  },
                  reason: `Custom role for Patreon Supporter: ${message.member.user.username}.`,
                })
                .then(async (role) => {
                  const filter = { roleOwner: message.member.id };
                  const update = { roleID: role.id };
                  await this.client.db.keqingCustomRoles.findOneAndUpdate(
                    filter,
                    update
                  );
                  await role.setPosition(
                    global.guild.roles.cache.get(parentRole).position - 1
                  );
                  await message.member.roles.add(role.id);
                  message.channel.send(
                    new Discord.MessageEmbed({
                      color: role.color,
                      description: `Successfully prepared and assigned your custom role to you!`,
                      fields: [
                        {
                          name: 'Role Name',
                          value: role.name,
                          inline: true,
                        },
                        {
                          name: 'Role Color',
                          value: role.color,
                          inline: true,
                        },
                        {
                          name: 'Edit Role Name',
                          value: `${prefix}myrole --name <new name>`,
                        },
                        {
                          name: 'Edit Role Color',
                          value: `${prefix}myrole --color <new color>`,
                        },
                      ],
                    })
                  );
                });
            });
      } else
        return message.channel.send(
          new Discord.MessageEmbed({
            color: 'RED',
            description: `Sorry to say but only KQM Patreon supporters can have a custom role.`,
            fields: [
              {
                name: 'KQM Patreon',
                value: 'https://patreon.com/KQM',
                inline: true,
              },
            ],
          })
        );
    }
  }
}

// module.exports = MyRoleCommand;
