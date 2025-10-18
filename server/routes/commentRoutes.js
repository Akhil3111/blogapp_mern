const express = require('express');
const { 
    getComments, 
    addComment, 
    deleteComment, 
    updateComment 
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.get('/:postId', getComments);

// Protected Routes
router.post('/:postId', protect, addComment);
router.delete('/:id', protect, deleteComment);
router.put('/:id', protect, updateComment);

module.exports = router;