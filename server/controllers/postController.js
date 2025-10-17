const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get all published posts (public feed)
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        // Only fetch posts that are 'Published'
        const posts = await Post.find({ status: 'Published' })
            .populate('author', 'username role') 
            .sort({ createdAt: -1 }); 

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching posts.' });
    }
};

// --- NEW FUNCTION: Get all posts by the logged-in user ---
// @desc    Get all posts by logged-in user (Drafts & Published)
// @route   GET /api/v1/posts/me
// @access  Private (User, Admin)
exports.getUserPosts = async (req, res) => {
    try {
        // Find posts where the author ID matches the logged-in user's ID
        const posts = await Post.find({ author: req.user.id })
            .populate('author', 'username role') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error fetching user posts.' });
    }
};

// @desc    Get a single post (No changes needed here)
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
        const isAuthor = req.user && post.author._id.toString() === req.user.id;
        if (post.status === 'Draft' && (!req.user || (!isAuthor && req.user.role !== 'admin'))) {
             return res.status(403).json({ success: false, error: 'Post is a draft and cannot be viewed.' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
             return res.status(404).json({ success: false, error: 'Invalid Post ID format' });
        }
        res.status(500).json({ success: false, error: 'Server error fetching post.' });
    }
};

// @desc    Create new post (No changes needed here)
// @route   POST /api/v1/posts
// @access  Private (User, Admin)
exports.createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Thumbnail image is required.' });
        }

        // Add the image URL from Cloudinary to the request body
        req.body.thumbnail = req.file.path;

        // Assign the authenticated user as the author
        req.body.author = req.user.id;

        // Set status to 'Published' by default
        req.body.status = 'Published';

        const post = await Post.create(req.body);
        res.status(201).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update a post
// @route   PUT /api/v1/posts/:id
// @access  Private (Author or Admin)
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // Authorization check
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this post' });
        }

        // Update thumbnail URL if new file was uploaded
        if (req.file) {
            req.body.thumbnail = req.file.path;
        }

        post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:id
// @access  Private (Author or Admin)
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }

        // --- PERMISSION CHECK ADDED HERE ---
        // Authorization check: Must be the author OR an admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this post. You must be the author or an administrator.' });
        }
        // --- END PERMISSION CHECK ---

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during delete.' });
    }
};

// --- LIKE/DISLIKE LOGIC FIX (Refined from previous version for clarity) ---

// @desc    Like a post
// @route   PUT /api/v1/posts/:id/like
// @access  Private (User, Admin)
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        const userId = req.user.id;
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // Unliking: Pull user ID from 'likes' array
            post.likes.pull(userId);
        } else {
            // Liking: Add user ID to 'likes' array
            post.likes.push(userId);
            // If disliked, remove from 'dislikes' array
            post.dislikes.pull(userId); 
        }

        await post.save();
        res.status(200).json({ success: true, data: post });

    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during like operation.' });
    }
};

// @desc    Dislike a post
// @route   PUT /api/v1/posts/:id/dislike
// @access  Private (User, Admin)
exports.dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        const userId = req.user.id;
        const alreadyDisliked = post.dislikes.includes(userId);

        if (alreadyDisliked) {
            // Undisliking: Pull user ID from 'dislikes' array
            post.dislikes.pull(userId);
        } else {
            // Disliking: Add user ID to 'dislikes' array
            post.dislikes.push(userId);
            // If liked, remove from 'likes' array
            post.likes.pull(userId); 
        }

        await post.save();
        res.status(200).json({ success: true, data: post });

    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during dislike operation.' });
    }
};