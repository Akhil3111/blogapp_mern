const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get all comments for a specific post
// @route   GET /api/v1/comments/:postId
// @access  Public
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId })
            .populate('author', 'username role')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching comments.' });
    }
};

// @desc    Add a comment to a post
// @route   POST /api/v1/comments/:postId
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found.' });
        }

        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ success: false, error: 'Comment content cannot be empty.' });
        }

        const comment = await Comment.create({
            content: content,
            post: postId,
            author: req.user.id,
        });
        
        await comment.populate('author', 'username');

        res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
        }

        await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });
        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during comment delete.' });
    }
};

// @desc    Update a comment
// @route   PUT /api/v1/comments/:id
// @access  Private (Comment Author Only)
exports.updateComment = async (req, res) => {
    try {
        const { id: commentId } = req.params;
        const { content } = req.body;

        // Validate content
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Comment content cannot be empty.' 
            });
        }

        // Find and check comment exists
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ 
                success: false, 
                error: 'Comment not found' 
            });
        }

        // Check authorization
        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                error: 'Not authorized to update this comment' 
            });
        }

        // Update comment
        comment.content = content.trim();
        comment.updatedAt = Date.now();
        await comment.save();

        // Populate author details
        await comment.populate('author', 'username');

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: 'Server error while updating comment.' 
        });
    }
};