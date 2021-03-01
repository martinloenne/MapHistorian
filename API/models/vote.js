const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema(
  {
    pin: {
        type: mongoose.Schema.ObjectId,
        ref: 'pin',
        required: true,
        default: null
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: false,
      default: null
    },
    type: {
      type: String, 
      enum: ['upvote',
            'downvote'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

voteSchema.index({'pin': 1, 'user': 1}, {unique: true});  // Pin AND User needs to be unique before this model can be created

module.exports = mongoose.model('vote', voteSchema);