// Serverless function entry point for Vercel
const app = require('../app');
const connectDB = require('../config/database');

// Initialize database connection once on cold start
let dbConnected = false;

const initDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database initialized');
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
};

// Handler function that Vercel will call for each request
module.exports = async (req, res) => {
  // Ensure database is connected
  if (!dbConnected) {
    await initDB();
  }

  // Pass request to Express app
  return app(req, res);
};
