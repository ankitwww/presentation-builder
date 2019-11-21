const mongoose = require('mongoose');

// define the schema for our user model
const userSchema = mongoose.Schema(
  {
    userId: { type: String, isRequired: true },
    token: { type: String },
    email: { type: String },
    name: { type: String },
    given_name: { type: String },
    family_name: { type: String },
    picture: { type: String },
    lastAccessDate: { type: Date }
  },
  { collection: 'user' }
);

// create the model for users and expose it to our app
module.exports = userSchema;
