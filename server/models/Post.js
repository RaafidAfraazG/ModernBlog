// server/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 120
  },
  content: {
    type: String,
    required: true,
    minlength: 50
  },
  // Support both URL and uploaded images
  imageURL: {
    type: String,
    validate: {
      validator: function(v) {
        // Basic URL validation - can be enhanced later
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Please provide a valid URL'
    }
  },
  // New field for uploaded images
  image: {
    url: {
      type: String,
    },
    publicId: {
      type: String, // Cloudinary public ID for deletion
    }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Virtual field to get the display image (either uploaded or URL)
postSchema.virtual('displayImage').get(function() {
  if (this.image && this.image.url) {
    return this.image.url;
  }
  return this.imageURL;
});

// Include virtuals when converting to JSON
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);