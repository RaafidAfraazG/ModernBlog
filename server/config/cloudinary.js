// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const uploadToCloudinary = async (fileBuffer, originalName) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'blog-posts', // Organize images in a folder
          public_id: `post-${Date.now()}`, // Unique filename
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Limit max dimensions
            { quality: 'auto' }, // Optimize quality
            { fetch_format: 'auto' } // Auto format (WebP, etc.)
          ]
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    throw new Error('Image upload failed: ' + error.message);
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
    // Don't throw error - we don't want to fail the whole operation
    // if image deletion fails
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};