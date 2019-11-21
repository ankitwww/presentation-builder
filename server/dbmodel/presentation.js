const mongoose = require('mongoose');

const presentationSchema = mongoose.Schema(
  {
    userId: { type: String, isRequired: true },
    author: { type: String },
    name: { type: String },
    description: { type: String },
    images: {
      type: [
        {
          order: { type: Number },
          url: { type: String },
          name: { type: String },
          audioFile: { type: String },
          audioFileLength: { type: Number }
        }
      ]
    },
    creationDate: { type: Date },
    lastModifiedDate: { type: Date }
  },
  { collection: 'presentations' }
);

// create the model for users and expose it to our app
module.exports = presentationSchema;
