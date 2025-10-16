const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment cannot be empty'],
        trim: true,
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true,
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true
});

// Index the post ID for fast querying of all comments on a single post
CommentSchema.index({ post: 1 });

module.exports = mongoose.model('Comment', CommentSchema);