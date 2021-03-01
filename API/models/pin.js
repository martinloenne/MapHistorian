const slugify = require('slugify');
const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name for the project'],
      unique: true,
      trim: true,
      maxlength: [80, 'Name need to be less than 80 characteres']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: false,
      default: null
    },
    latitude: {
      type:  Number,
      required: true
    },
    longitude: {
      type:  Number,
      required: true
    },
    type: {
      type: String, 
      enum: ['Temple',
            'Statues',
            'Museum',
            'Ruins',
            'Battles',
            'Theatre',
            'Baths',
            'Gardens',
            'Shrine (Heroon)',
            'Drome',
            'Mausoleum',
            'Gate',
            'Columns',
            'Stadium',
            'Walkway',
            'Domes',
            'House/Villa',
            'Bridge',
            'Forum',
            'Odeon',
            'Other'],
            required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {  
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: false
    },
    approved: {
        type: Boolean,
        default: false
    },
    slugURL: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [200, 'Description can not be more than 200 characters']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

pinSchema.methods.changedName = function() {
  return 'wat';
};

// Reverse populate
pinSchema.virtual('votes', {
  ref: 'vote',
  localField: '_id',
  foreignField: 'pin',
  justOne: false
});


// Mongoose Middleware runs before(pre) save of the model
// Create project slug from the name
// This is used to make URL directly on the front-end
pinSchema.pre('save', function(next) {
  this.slugURL = slugify(this.name, { lower: true });
  next(); // Move to the next middleware if any
});

module.exports = mongoose.model('pin', pinSchema);