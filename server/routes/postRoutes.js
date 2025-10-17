const express = require('express');
const { 
    getPosts, getPost, createPost, updatePost, deletePost, 
    likePost, dislikePost, getUserPosts
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');
const parser = require('../config/cloudinary');

const router = express.Router();

// Public Routes
router.get('/', getPosts); 
router.get('/:id', getPost);

// Protected Content Creation Route
router.post('/', protect, parser.single('thumbnail'), createPost);

// --- THIS IS THE CORRECTED ROUTE ---
// User's Posts Route (My Blogs)
// The path is now '/my-blogs' which is more descriptive.
router.get('/my-blogs', protect, getUserPosts);

// Protected Routes (Update/Delete/Interactions)
router.put('/:id', protect, parser.single('thumbnail'), updatePost);
router.delete('/:id', protect, deletePost);

// User Interaction Routes
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, likePost);

// Admin-only Routes (no changes needed)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
    // ... logic remains the same ...
});

router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    // ... logic remains the same ...
});

module.exports = router;