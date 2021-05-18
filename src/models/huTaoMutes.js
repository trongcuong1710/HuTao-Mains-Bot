const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoMutes',
  new mongoose.Schema({
    member_id: String,
    unmuteDate: Number,
  }),
  'huTaoMutes'
);
