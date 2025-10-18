const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get all published posts (public feed)
// @route   GET /api/v1/posts
// @access  Public
exports.getPosts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50); // cap limit to 50
        const skip = (page - 1) * limit;

        const totalPosts = await Post.countDocuments({ status: 'Published' });

        const posts = await Post.find({ status: 'Published' })
            .populate('author', 'username role') // Populate author details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.max(Math.ceil(totalPosts / limit), 1);

        res.status(200).json({
            success: true,
            count: posts.length,
            totalPages,
            currentPage: page,
            totalPosts,
            data: posts,
        });
    } catch (err) {
        console.error('getPosts error:', err);
        res.status(500).json({ success: false, error: 'Server error fetching posts.' });
    }
};

// @desc    Get all posts by logged-in user
// @route   GET /api/v1/posts/my-blogs
// @access  Private
exports.getUserPosts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50);
        const skip = (page - 1) * limit;
        const authorId = req.user.id;

        const totalPosts = await Post.countDocuments({ author: authorId });

        const posts = await Post.find({ author: authorId })
            .populate('author', 'username role') // Populate author details
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.max(Math.ceil(totalPosts / limit), 1);

        res.status(200).json({
            success: true,
            count: posts.length,
            totalPages,
            currentPage: page,
            totalPosts,
            data: posts,
        });
    } catch (err) {
        console.error('getUserPosts error:', err);
        res.status(500).json({ success: false, error: 'Server error fetching user posts.' });
    }
};

// @desc    Get a single post
// @route   GET /api/v1/posts/:id
// @access  Public (with Draft check)
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username role'); // Populate author details

        if (!post) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        
        // --- Draft Security Check ---
        // We need to check if a user is potentially logged in to check roles/authorship
        // A simple way is to use the auth middleware optionally, or decode the token manually if present
        // For simplicity, assuming protect middleware adds req.user if logged in:
        const loggedInUserId = req.user ? req.user.id : null;
        const loggedInUserRole = req.user ? req.user.role : null;
        const isAuthor = loggedInUserId && post.author._id.toString() === loggedInUserId;

        if (post.status === 'Draft' && (!isAuthor && loggedInUserRole !== 'admin')) {
             return res.status(403).json({ success: false, error: 'Not authorized to view this draft post.' });
        }
        // --- End Draft Check ---

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
             return res.status(400).json({ success: false, error: 'Invalid Post ID format' }); // Use 400 for bad ID format
        }
        res.status(500).json({ success: false, error: 'Server error fetching post.' });
    }
};

// @desc    Create new post
// @route   POST /api/v1/posts
// @access  Private
exports.createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Thumbnail image is required.' });
        }

        req.body.thumbnail = req.file.path;
        req.body.author = req.user.id;
        req.body.status = 'Published'; // Default to published

        let post = await Post.create(req.body);

        // --- FIX: Populate author before sending response ---
        post = await post.populate('author', 'username role');

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

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to update this post' });
        }

        if (req.file) {
            req.body.thumbnail = req.file.path;
        }

        // Use findByIdAndUpdate to apply changes
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true,
        })
        // --- FIX: Populate author on the updated document ---
        .populate('author', 'username role');

        res.status(200).json({ success: true, data: updatedPost });
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

        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this post.' });
        }
        
        // TODO: Consider deleting associated comments before deleting the post
        // await Comment.deleteMany({ post: req.params.id });

        await post.deleteOne();

        res.status(200).json({ success: true, data: {} }); // No need to return data
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during delete.' });
    }
};

// @desc    Like a post
// @route   PUT /api/v1/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        const userId = req.user.id;
        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
            post.dislikes.pull(userId);
        }

        await post.save();
        
        // --- FIX: Populate author before sending response ---
        post = await post.populate('author', 'username role');

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during like operation.' });
    }
};

// @desc    Dislike a post
// @route   PUT /api/v1/posts/:id/dislike
// @access  Private
exports.dislikePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

        const userId = req.user.id;
        const alreadyDisliked = post.dislikes.includes(userId);

        if (alreadyDisliked) {
            post.dislikes.pull(userId);
        } else {
            post.dislikes.push(userId);
            post.likes.pull(userId);
        }

        await post.save();
        
        // --- FIX: Populate author before sending response ---
        post = await post.populate('author', 'username role');

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during dislike operation.' });
    }
};