const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get all published posts (public feed)
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        // Only fetch posts that are 'Published'
        const posts = await Post.find({ status: 'Published' })
            .populate('author', 'username role') // Include author's username and role
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching posts.' });
    }
};

// @desc    Get authenticated user's posts (including drafts)
// @route   GET /api/v1/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.user.id }) // <-- Filter by authenticated user's ID
            .populate('author', 'username role') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching your posts.' });
    }
};


// @desc    Get a single post
// @route   GET /api/v1/posts/:id
// @access  Public
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username role');

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        
        // Block viewing of Drafts by public users (unless they are the author or admin)
        if (post.status === 'Draft' && (!req.user || req.user.role !== 'admin' && post.author.toString() !== req.user.id.toString())) {
             return res.status(403).json({ success: false, error: 'Post is a draft and cannot be viewed.' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        // Handle invalid ID format
        if (err instanceof mongoose.Error.CastError) {
             return res.status(404).json({ success: false, error: 'Invalid Post ID format' });
        }
        res.status(500).json({ success: false, error: 'Server error fetching post.' });
    }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private (User, Admin)
exports.createPost = async (req, res) => {
    try {
        // Assign the authenticated user as the author
        req.body.author = req.user.id;
        
        // Handle thumbnail path from multer
        if (req.file) {
            // Store the path relative to the server's public folder
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        // If no file, it defaults to 'no-photo.jpg' from the schema

        const post = await Post.create(req.body);

        res.status(201).json({
            success: true,
            data: post,
        });
    } catch (err) {
        // Add specific handling for Multer errors here if needed
        res.status(400).json({ success: false, error: err.message });
    }
};

// ... (updatePost, deletePost, likePost, dislikePost functions remain the same) ...

// All functions below are preserved from the original file:
exports.updatePost = async (req, res) => { /* ... */ };
exports.deletePost = async (req, res) => { /* ... */ };
exports.likePost = async (req, res) => { /* ... */ };
exports.dislikePost = async (req, res) => { /* ... */ };