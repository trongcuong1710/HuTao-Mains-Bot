const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoWarns',
  new mongoose.Schema({
    warnID: Number,
    warnedMember: String,
    warnedStaff: String,
    reason: String,
    when: Date,
  }),
  'huTaoWarns'
);
