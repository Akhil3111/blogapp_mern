// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/', // The directory where files will be stored
    filename: function(req, file, cb) {
        // Create a unique filename (e.g., thumbnail-1634234567890.jpg)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize Upload Middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 }, // 2MB limit (Adjust as needed)
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('thumbnail'); // 'thumbnail' must match the key used in client FormData

// Check File Type function
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Only image files (JPEG, PNG, GIF) are allowed!'));
    }
}

module.exports = upload;