const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoBlacklists',
  new mongoose.Schema({
    channel_id: String,
    blacklistedBy: String,
  }),
  'huTaoBlacklists'
);
