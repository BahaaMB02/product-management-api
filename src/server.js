require('dotenv').config();
const express = require('express');
const { connectDB } = require('./database/db');
const productRoutes = require('./routes/product-route');
const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// Product routes
app.use('/api', productRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});