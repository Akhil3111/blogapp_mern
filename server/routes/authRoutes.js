const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout); // Logout only if authenticated

module.exports = router;