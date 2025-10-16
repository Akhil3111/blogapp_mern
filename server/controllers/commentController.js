const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get all comments for a specific post
// @route   GET /api/v1/comments/:postId
// @access  Public
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId })
            .populate('author', 'username role') // Show who wrote the comment
            .sort({ createdAt: 1 }); // Oldest first

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
// @access  Private (User, Admin)
exports.addComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found to comment on.' });
        }

        req.body.post = postId;
        req.body.author = req.user.id; // Get author from auth middleware

        const comment = await Comment.create(req.body);

        // Update comment count on the Post
        post.commentCount = await Comment.countDocuments({ post: postId });
        await post.save();

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
// @access  Private (Comment Author or Admin)
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, error: 'Comment not found' });
        }

        // Authorization check: Must be the author OR an admin
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this comment' });
        }

        // Decrement comment count on the Post before deleting
        await Post.findByIdAndUpdate(comment.post, { $inc: { commentCount: -1 } });

        await comment.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during comment delete.' });
    }
};