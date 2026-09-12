import mongoose from 'mongoose';

/**
 * Connect to MongoDB with Mongoose
 * Handles graceful connection, connection state logging, and error handling
 */
const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI || mongoURI.trim() === '') {
    console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------');
    console.log('\x1b[33m%s\x1b[0m', '⚠️  MONGO_URI is not set in backend/.env');
    console.log('\x1b[33m%s\x1b[0m', '👉 Server is running in Standby Mode.');
    console.log('\x1b[33m%s\x1b[0m', '👉 Paste your MongoDB connection string in backend/.env:');
    console.log('\x1b[36m%s\x1b[0m', '   MONGO_URI=mongodb+srv://<username>:<password>@...');
    console.log('\x1b[33m%s\x1b[0m', '---------------------------------------------------------');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------------');
    console.log('\x1b[32m%s\x1b[0m', `✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log('\x1b[32m%s\x1b[0m', `📦 Database Name: ${conn.connection.name}`);
    console.log('\x1b[32m%s\x1b[0m', '---------------------------------------------------------');
    return true;
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
    console.error('\x1b[31m%s\x1b[0m', `❌ MongoDB Connection Failed: ${error.message}`);
    console.error('\x1b[33m%s\x1b[0m', '👉 Please check your MongoDB URI, network/IP whitelist, or credentials.');
    console.error('\x1b[31m%s\x1b[0m', '---------------------------------------------------------');
    return false;
  }
};

export default connectDB;
