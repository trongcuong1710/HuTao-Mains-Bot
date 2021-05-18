const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoQuotes',
  new mongoose.Schema(
    {
      quoteName: String,
      quote: String,
      by: String,
      embed: Boolean,
    },
    { typeKey: '$type' }
  ),
  'huTaoQuotes'
);
