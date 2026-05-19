const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const restaurants = require('./routes/restaurants');
const dishes = require('./routes/dishes');
const orders = require('./routes/orders');
const users = require('./routes/users');
const search = require('./routes/search');
const chatbot = require('./routes/chatbot');


// Mount API routers
app.use('/api/auth', auth);
app.use('/api/admin', admin);
app.use('/api/restaurants', restaurants);
app.use('/api/dishes', dishes);
app.use('/api/orders', orders);
app.use('/api/users', users);
app.use('/api/search', search);
app.use('/api/chatbot', chatbot);

// Landing shortcut: create a quick order from query param and redirect home
// Serve the main HTML file for root route

// Serve the main HTML file for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for non-API routes (SPA support)
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      message: 'API route not found'
    });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error'
  });
});

module.exports = app;