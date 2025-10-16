const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes: Check for a valid JWT token
exports.protect = async (req, res, next) => {
    let token;

    // Check for token in the 'Authorization' header (Bearer Token)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // 401: Unauthorized
        return res.status(401).json({ success: false, error: 'Not authorized to access this route (No token).' });
    }

    try {
        // 1. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 2. Attach user to the request object (excluding password)
        req.user = await User.findById(decoded.id).select('-password');
        
        // Handle case where user might have been deleted but token is still valid
        if (!req.user) {
             return res.status(401).json({ success: false, error: 'Not authorized, user not found.' });
        }

        next();

    } catch (err) {
        console.error("JWT Error:", err.message);
        // 401: Unauthorized (token failed, expired, or tampered)
        return res.status(401).json({ success: false, error: 'Not authorized, token failed.' });
    }
};

// Grant access to specific roles (e.g., admin)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the list of allowed roles
        if (!roles.includes(req.user.role)) {
            // 403: Forbidden
            return res.status(403).json({ 
                success: false, 
                error: `User role ${req.user.role} is not authorized to access this route.` 
            });
        }
        next();
    };
};