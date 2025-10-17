const express = require('express');
const { 
    getPosts, getPost, createPost, updatePost, deletePost, 
    likePost, dislikePost, getUserPosts
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');
const parser = require('../config/cloudinary');

const router = express.Router();

// --- Public Routes ---
router.get('/', getPosts);

// FIX: Specific routes must come BEFORE dynamic routes
router.get('/my-blogs', protect, getUserPosts);

// Dynamic route is now after '/my-blogs'
router.get('/:id', getPost);

// --- Protected Routes ---
router.post('/', protect, parser.single('thumbnail'), createPost);
router.put('/:id', protect, parser.single('thumbnail'), updatePost);
router.delete('/:id', protect, deletePost);

// --- User Interaction Routes ---
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);

module.exports = router;