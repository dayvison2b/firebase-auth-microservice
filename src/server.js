// src/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swaggerOptions');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Check what it is


// Middleware function to log requests
app.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

// Routes
app.use('/v1/user/auth', require('./routes/authRoute'));

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Start the server
    app.listen(PORT, () => {
      console.log(`Auth service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { app, startServer };

startServer();