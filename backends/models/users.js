const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;
autoIncrement.initialize(mongoose);

const userSchema = new Schema({
  'user_id': {type: Number},
  'name': {type: String},
  'password': {type: String},
  'email': {type: String},
  'date': {type: Date, default: Date.now}
}, {collection: 'Users'});

userSchema.plugin(uniqueValidator);
userSchema.plugin(autoIncrement.plugin, {model: 'userModel',
field: 'user_id', startAt: 100, incrementBy: 1});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
