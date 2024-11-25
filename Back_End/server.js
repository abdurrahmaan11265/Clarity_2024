// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const testRoutes = require('./routes/testRoutes'); // Import the test routes
const morgan = require('morgan');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(morgan('combined')); // Log requests to the console
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/tests', testRoutes); // Add the test routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));