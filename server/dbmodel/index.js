const mongoose = require('mongoose');

mongoose.models = {};
mongoose.modelSchemas = {};

const presentation = require('./presentation');
const user = require('./user');

module.exports = {
  presentation: mongoose.model('presentation', presentation),
  user: mongoose.model('user', user)
};
