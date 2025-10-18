const User = require('../models/User');
const Post = require('../models/Post'); // Import the Post model
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken'); // Assuming you use JWT for tokens

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password, role } = req.body; // Add role if you allow setting it during register

    // Create user
    const user = await User.create({
        username,
        email,
        password,
        role // If role is not provided, the default from the schema will be used
    });

    sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password'); // Include password for comparison

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged-in user profile & posts
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // req.user is populated by the 'protect' middleware
    const userId = req.user.id;

    // Fetch user details (excluding password)
    const user = await User.findById(userId).select('-password');

    if (!user) {
        // This case should rarely happen if protect middleware works
        return next(new ErrorResponse('User not found', 404));
    }

    // Fetch all posts by this user
    const posts = await Post.find({ author: userId })
        .populate('author', 'username role') // Still useful for consistency
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        user: user,   // Send user details
        posts: posts  // Send user's posts
    });
});

// @desc    Get current user profile & paginated posts
// @route   GET /api/v1/auth/me?page=1&limit=6
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 50); // cap limit to 50
    const skip = (page - 1) * limit;

    const user = await User.findById(userId).select('-password');
    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    const totalPosts = await Post.countDocuments({ author: userId });

    const posts = await Post.find({ author: userId })
        .populate('author', 'username role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalPages = Math.max(Math.ceil(totalPosts / limit), 1);

    res.status(200).json({
        success: true,
        user,
        posts: {
            data: posts,
            totalPages,
            currentPage: page,
            totalPosts
        }
    });
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // In a stateless JWT setup, logout is primarily handled client-side by removing the token.
    // If using cookies, clear the cookie.
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expire in 10 seconds
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Helper function to get token, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Convert days to ms
        ),
        httpOnly: true // Cookie cannot be accessed via client-side scripts
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true; // Only send cookie over HTTPS in production
    }

    // Remove password from user object before sending response
    const userResponse = { ...user._doc };
    delete userResponse.password;

    res
        .status(statusCode)
        .cookie('token', token, options) // Set token in cookie (optional, depends on auth strategy)
        .json({
            success: true,
            token,         // Also send token in response body for flexibility
            user: userResponse // Send user data (without password)
        });
};

// Ensure asyncHandler and ErrorResponse are correctly required/defined based on your project structure
// const asyncHandler = require('../middleware/asyncHandler');
// const ErrorResponse = require('../utils/errorResponse');