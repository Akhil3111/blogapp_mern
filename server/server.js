// server/server.js

require('dotenv').config({ path: './.env' }); // Load environment variables first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser'); // To handle cookies (for JWT)

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
// Add this early in your server setup (e.g., server.js)
const path = require('path');

const app = express();
app.use(express.static('public')); // This makes files in 'public' accessible


const PORT = process.env.PORT || 5000;

// --- Database Connection ---
connectDB();

// --- Middleware Setup ---
app.use(cors()); // Allow requests from our React frontend domain
app.use(express.json()); // Body parser for JSON data
app.use(cookieParser()); // Cookie parser for accessing JWT from cookie

// --- Mount Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes); // Note: Comment routes are nested by post ID

// Basic Test Route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'QuickBlog API v1 is operational.' });
});

// --- Server Startup ---
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

// Handle unhandled rejections (e.g., failed DB connection after initial attempt)
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});