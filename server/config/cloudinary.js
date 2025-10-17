const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary using .env variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create a storage engine instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'quickblog-thumbnails', // Folder where images will be stored in Cloudinary
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 500, height: 500, crop: "limit" }] // Optional: Resize/optimize on upload
    },
});

// Export the configured Multer instance
const parser = multer({ storage: storage });

module.exports = parser;