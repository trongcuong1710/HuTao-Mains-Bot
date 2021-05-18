const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoModmail',
  new mongoose.Schema({
    channel_id: String,
    member_id: String,
  }),
  'huTaoModmail'
);
