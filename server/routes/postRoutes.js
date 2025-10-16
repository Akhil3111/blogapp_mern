const express = require('express');
const { 
    getPosts, getPost, createPost, updatePost, deletePost, 
    likePost, dislikePost, getMyPosts // <-- ADDED getMyPosts
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); // <-- ADDED

const router = express.Router();

// Publicly accessible post list
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected Routes (Requires Authentication)

// New route to fetch only the authenticated user's posts (used for Blog Lists page)
router.get('/my-posts', protect, getMyPosts); // <-- NEW ROUTE

// Create Post (Handles file upload via 'upload' middleware)
router.post('/', protect, upload, createPost); 

// Update/Delete (Existing routes)
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// User Interaction Routes
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);

// --- Admin/Dashboard Specific Routes ---

// A dedicated route for Admin to manage ALL posts (including drafts)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
    // Controller logic to fetch ALL posts regardless of status
    const allPosts = await require('../models/Post').find()
        .populate('author', 'username role')
        .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: allPosts.length, data: allPosts });
});

// Admin-only route to publish/unpublish a post (update its status)
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    const post = await require('../models/Post').findByIdAndUpdate(
        req.params.id, 
        { status: req.body.status },
        { new: true, runValidators: true }
    );
    if (!post) {
        return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
});


module.exports = router;