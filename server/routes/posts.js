// server/routes/posts.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// Get all posts (with search and pagination)
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = search ? { 
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const posts = await Post.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get posts by current user (protected) - MOVE THIS BEFORE THE /:id ROUTE
router.get('/user/me', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create post with image upload (protected)
router.post('/', auth, upload.single('image'), [
  body('title').isLength({ min: 5, max: 120 }).trim().withMessage('Title must be 5-120 characters'),
  body('content').isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('imageURL').optional().isURL().withMessage('Please provide a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, content, imageURL } = req.body;
    
    let imageData = {};
    
    // Handle uploaded file
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        imageData = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
      } catch (uploadError) {
        return res.status(400).json({ 
          message: 'Image upload failed', 
          error: uploadError.message 
        });
      }
    }

    const post = new Post({
      title,
      content,
      imageURL: imageURL || undefined, // URL-based image
      image: req.file ? imageData : undefined, // Uploaded image
      author: req.user._id,
      authorName: req.user.username
    });

    await post.save();
    await post.populate('author', 'username');

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}, handleUploadError);

// Update post with image upload (protected, owner only)
router.put('/:id', auth, upload.single('image'), [
  body('title').isLength({ min: 5, max: 120 }).trim().withMessage('Title must be 5-120 characters'),
  body('content').isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('imageURL').optional().isURL().withMessage('Please provide a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, content, imageURL, removeImage } = req.body;
    
    // Handle image removal
    if (removeImage === 'true' && post.image && post.image.publicId) {
      await deleteFromCloudinary(post.image.publicId);
      post.image = undefined;
    }
    
    // Handle new uploaded file
    if (req.file) {
      // Delete old uploaded image if exists
      if (post.image && post.image.publicId) {
        await deleteFromCloudinary(post.image.publicId);
      }
      
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        post.image = {
          url: uploadResult.url,
          publicId: uploadResult.publicId
        };
        // Clear imageURL if uploading new file
        post.imageURL = undefined;
      } catch (uploadError) {
        return res.status(400).json({ 
          message: 'Image upload failed', 
          error: uploadError.message 
        });
      }
    } else {
      // Update imageURL only if no file uploaded and not removing image
      if (removeImage !== 'true') {
        post.imageURL = imageURL || undefined;
        // Clear uploaded image if setting URL
        if (imageURL && post.image && post.image.publicId) {
          await deleteFromCloudinary(post.image.publicId);
          post.image = undefined;
        }
      }
    }
    
    post.title = title;
    post.content = content;

    await post.save();
    await post.populate('author', 'username');

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}, handleUploadError);

// Delete post (protected, owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete associated image from Cloudinary if exists
    if (post.image && post.image.publicId) {
      await deleteFromCloudinary(post.image.publicId);
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// NEW: Upload image endpoint (can be used independently)
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.originalname);
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Image upload failed', 
      error: error.message 
    });
  }
}, handleUploadError);

module.exports = router;