const { Listener } = require('discord-akairo');
const Discord = require('discord.js');
const channels = require('../../Constants/channels.json');
const roles = require('../../Constants/roles.json');

class GuildMemberUpdateListener extends Listener {
  constructor() {
    super('guildMemberUpdate', {
      emitter: 'client',
      event: 'guildMemberUpdate',
      category: 'Client',
    });
  }
  async exec(oldMember, newMember) {
    var messages = [
      "That indulgent feeling of being spoilt by you... Thank you. I won't forget your kindness.",
      'I’m grateful that you’re always here and supporting us!',
      'Your support have thrilled me,and I’m overwhelmed with happiness. This encouragement is what keeps me going. Thank you for the support.',
      "Thank you; I appreciate everyone who has been a part of this. None of this could’ve been possible without your contribution. It's not like I like you... but all of you are valuable to me.",
    ];

    const nitroBoosterRole = global.guild.roles.cache.get(
      roles.nitroBoosterRole
    );

    var randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const wasntBoosting = oldMember.roles.cache.find(
      (role) => role.id === nitroBoosterRole.id
    );
    const isBoosting = newMember.roles.cache.find(
      (role) => role.id === nitroBoosterRole.id
    );

    const keqingLove = new Discord.MessageAttachment(
      'https://cdn.discordapp.com/emojis/834965684126482493.png?v=1'
    );

    if (!wasntBoosting && isBoosting) {
      newMember.guild.channels.cache
        .get(channels.starboardChannel)
        .send(`${newMember}, ${randomMessage}`, keqingLove);
      // await newMember.roles.add('843445348760158218'); // Boosted role (kqm)
    }

    // const wasntSupporting = oldMember.roles.cache.find(
    //   (role) => role.id === roles.adeptusPatreon
    // );
    // const isSupporting = newMember.roles.cache.find(
    //   (role) => role.id === roles.adeptusPatreon
    // );

    // const customRoles = await this.client.db.keqingCustomRoles.find({
    //   roleOwner: newMember.id,
    // });
    // const role = global.guild.roles.cache.get(
    //   customRoles.map((x) => x.roleID).join('\n')
    // );
    // const prefix = this.client.commandHandler.prefix;
    // if (!wasntSupporting && isSupporting) {
    //   newMember
    //     .send(
    //       new Discord.MessageEmbed({
    //         color: 'GREEN',
    //         title: 'You have unlocked a new perk by being a patreon supporter!',
    //         description: `You can now have a custom role you desire!`,
    //         fields: [
    //           {
    //             name: `${prefix}myrole <role name>`,
    //             value: `Creates a custom role with the given name.`,
    //           },
    //           {
    //             name: `${prefix}myrole --name <new name>`,
    //             value: `Edits your role name.`,
    //             inline: true,
    //           },
    //           {
    //             name: `${prefix}myrole --color <new color>`,
    //             value: `Edits your role color.`,
    //             inline: true,
    //           },
    //         ],
    //       })
    //     )
    //     .catch(() => {
    //       global.guild.channels.cache.get(channels.patronsOnlyChannel).send(
    //         newMember,
    //         new Discord.MessageEmbed({
    //           color: 'GREEN',
    //           title:
    //             'You have unlocked a new perk by being a patreon supporter!',
    //           description: `You can now have a custom role you desire!`,
    //           fields: [
    //             {
    //               name: `${prefix}myrole <role name>`,
    //               value: `Creates a custom role with the given name.`,
    //             },
    //             {
    //               name: `${prefix}myrole --name <new name>`,
    //               value: `Edits your role name.`,
    //               inline: true,
    //             },
    //             {
    //               name: `${prefix}myrole --color <new color>`,
    //               value: `Edits your role color.`,
    //               inline: true,
    //             },
    //           ],
    //         })
    //       );
    //     });
    // }

    // if (wasntSupporting && !isSupporting) {
    //   newMember
    //     .send(
    //       new Discord.MessageEmbed({
    //         color: 'RED',
    //         description: `You lost your custom role due to expiration of your patreon support.`,
    //       })
    //     )
    //     .then(async () => {
    //       await this.client.db.keqingCustomRoles.deleteOne({
    //         roleID: role.id,
    //       });
    //       if (!role) return;
    //       role.delete('No more a patreon supporter.');
    //     })
    //     .catch((e) => {
    //       return;
    //     });
    // }
  }
}

module.exports = GuildMemberUpdateListener;
