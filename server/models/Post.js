const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Post must have a title'],
        trim: true,
        maxlength: 100
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: [true, 'Post must have content'],
    },
    thumbnail: {
        type: String,
        default: 'no-photo.jpg' // Placeholder for thumbnail image URL
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: [String], // Array to store categories/tags
        required: true,
        default: ['General'],
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft',
    },
    // Array of User IDs who liked the post (for tracking likes/dislikes)
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    // The commentCount will be automatically updated via a Mongoose hook (optional, but good practice)
    commentCount: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true, // createdAt and updatedAt
});

// Optional: Virtual property for easy access to comments
PostSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false,
});

module.exports = mongoose.model('Post', PostSchema);