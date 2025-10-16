const User = require('../models/User');

// Helper function to send token in response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    // Set cookie options
    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000), // e.g., 30 days
        httpOnly: true,
    };

    // NOTE: In a production environment, set secure: true if using HTTPS
    // if (process.env.NODE_ENV === 'production') { options.secure = true; }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
};

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
    console.log("Registration request body:");
    try {
        const { username, email, password } = req.body;

        const user = await User.create({
            username,
            email,
            password,
        });

        // Use helper function to send response and JWT
        sendTokenResponse(user, 201, res);

    } catch (err) {
        // 400 for client errors like validation failure
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // 1. Find user by email (select password too)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // 2. Check password
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // 3. Send token
        sendTokenResponse(user, 200, res);

    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error during login.' });
    }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        data: {},
        message: 'Logged out successfully'
    });
};