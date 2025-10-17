require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// --- Middleware Setup ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser
app.use(express.static('public')); // Serve static files from public folder

// --- Database Connection ---
connectDB();

// --- Mount Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);

// --- Server Startup ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});