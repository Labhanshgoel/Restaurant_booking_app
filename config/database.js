const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection with optimized settings
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool settings for MongoDB Atlas
      maxPoolSize: 10,
      minPoolSize: 5,
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Connection settings
      family: 4, // Use IPv4
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ Database Connection Error:', error.message);
    
    // Helpful error messages for common issues
    if (error.name === 'MongoAuthenticationError') {
      console.error('   → Check your username and password in MONGODB_URI');
      console.error('   → Ensure special characters are URL-encoded');
    } else if (error.name === 'MongoNetworkError') {
      console.error('   → Check your IP address is whitelisted in MongoDB Atlas Network Access');
      console.error('   → Verify your internet connection');
    } else if (error.name === 'MongoServerError') {
      console.error('   → Check that your MongoDB cluster is running');
      console.error('   → Verify the database name in your connection string');
    }
    
    console.error('\n📖 See MONGODB_ATLAS_SETUP.md for detailed setup instructions');
    throw error;
  }
};

module.exports = connectDB;