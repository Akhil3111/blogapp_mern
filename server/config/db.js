// server/config/db.js

const mongoose = require('mongoose');

// Function to establish connection to MongoDB
const connectDB = async () => {
    try {
        // MONGODB_URI is loaded from the .env file via the dotenv package in server.js
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options prevent deprecation warnings and ensure a stable connection
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error and exit the application process if connection fails
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
