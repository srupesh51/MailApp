const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose);

const composeMail = new Schema({
  MailID: {type: Number, required: true, unique: true},
  UserID: {type: Number},
  Messages: {type: Array},
  createdOn: {type: Date, default: Date.now},
}, {collection: 'ComposeMail'});

composeMail.plugin(uniqueValidator);
composeMail.plugin(autoIncrement.plugin, {model: 'composeMailModel', field: 'MailID', startAt: 1, incrementBy: 1});

const composeMailModel = mongoose.model('ComposeMailMaster', composeMail);

module.exports = composeMailModel;
