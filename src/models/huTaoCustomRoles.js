const mongoose = require('mongoose');

module.exports = mongoose.model(
  'huTaoCustomRoles',
  new mongoose.Schema({
    roleID: String,
    roleOwner: String,
  }),
  'huTaoCustomRoles'
);
