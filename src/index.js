const {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
} = require('discord-akairo');

require('dotenv').config();

const mongoose = require('mongoose');

class MyClient extends AkairoClient {
  constructor() {
    super(
      {
        ownerID: '488699894023061516',
      },
      {
        disableMentions: 'everyone',
        fetchAllMembers: true,
        //partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
        presence: {
          activity: {
            name: `over my ghost.`,
            type: 'WATCHING',
          },
          status: 'online',
          afk: false,
        },
      }
    );
    this.commandHandler = new CommandHandler(this, {
      directory: './src/commands',
      prefix: 'h!',
      automateCategories: true,
      allowMention: true,
      blockBots: true,
      blockClient: true,
    });
    this.commandHandler.handle = async function (message) {
      // if (message.author.id !== this.client.ownerID) return;
      if (
        !(await this.client.db.huTaoBlacklists.findOne({
          channel_id: message.channel,
        }))
      )
        return CommandHandler.prototype.handle.call(this, message);
    };
    this.listenerHandler = new ListenerHandler(this, {
      directory: './src/listeners/',
      automateCategories: true,
    });
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
    });
    this.commandHandler.loadAll();
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();

    mongoose
      .connect(`${process.env.MONGOOSE_URL}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => console.log('Connected to the database!'));

    this.db = {
      huTaoWarns: mongoose.model(
        'huTaoWarns',
        new mongoose.Schema({
          warnID: Number,
          warnedStaff: String,
          warnedMember: String,
          reason: String,
          when: Date,
        }),

        'huTaoWarns'
      ),
      huTaoQuotes: mongoose.model(
        'huTaoQuotes',
        new mongoose.Schema({
          quoteName: String,
          quote: String,
          by: String,
          embed: Boolean,
        }),
        'huTaoQuotes'
      ),
      huTaoBlacklists: mongoose.model(
        'huTaoBlacklists',
        new mongoose.Schema({
          channel_id: String,
          blacklistedBy: String,
        }),
        'huTaoBlacklists'
      ),
      huTaoIgnoreList: mongoose.model(
        'huTaoIgnoreList',
        new mongoose.Schema({
          member_id: String,
          ignoredBy: String,
        }),
        'huTaoIgnoreList'
      ),
      huTaoCustomRoles: mongoose.model(
        'huTaoCustomRoles',
        new mongoose.Schema({
          roleID: String,
          roleOwner: String,
        }),
        'huTaoCustomRoles'
      ),
      huTaoModmail: mongoose.model(
        'huTaoModmail',
        new mongoose.Schema({
          channel_id: String,
          member_id: String,
        }),
        'huTaoModmail'
      ),
      huTaoMutes: mongoose.model(
        'huTaoMutes',
        new mongoose.Schema({
          member_id: String,
          unmuteDate: Number,
        }),
        'huTaoMutes'
      ),
    };
  }
}

const client = new MyClient();
client.login();
