const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');

const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose);

const outBoxMail = new Schema({
  ID: {type: Number, required: true, unique: true},
  MailID: {type: Number},
  Users: {type: Array},
  createdOn: {type: Date, default: Date.now},
}, {collection: 'OutBoxMail'});

outBoxMail.plugin(uniqueValidator);
outBoxMail.plugin(autoIncrement.plugin, {model: 'outboxMailModel', field: 'ID', startAt: 1, incrementBy: 1});

const outboxMailModel = mongoose.model('outboxMailMaster', outBoxMail);

module.exports = outboxMailModel;
