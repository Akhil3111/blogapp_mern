const express = require('express');
const {
    register,
    login,
    logout,
    getMe // Import the new controller function
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware'); // Middleware to check authentication

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require valid token)
router.get('/logout', protect, logout);
router.get('/me', protect, getMe); // Add the route for fetching profile

module.exports = router;