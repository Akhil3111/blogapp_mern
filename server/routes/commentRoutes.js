const express = require('express');
const { getComments, addComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all comments for a post (Public access)
router.get('/:postId', getComments);

// Add a comment (Requires Authentication)
router.post('/:postId', protect, addComment);

// Delete a comment (Requires Authentication and Ownership/Admin check)
router.delete('/:id', protect, deleteComment);

module.exports = router;