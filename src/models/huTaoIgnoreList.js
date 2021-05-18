const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoIgnoreList',
  new mongoose.Schema({
    member_id: String,
    ignoredBy: String,
  }),
  'huTaoIgnoreList'
);
