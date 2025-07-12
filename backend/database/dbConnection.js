import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CodeAwakening",
      // Connection pooling for better performance
      maxPoolSize: 10,
      minPoolSize: 2,
      // Connection timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Write concern for better performance
      writeConcern: {
        w: 1,
        j: false,
      },
      // Read preference for better performance
      readPreference: 'primary',
      // Buffer commands for better performance
      bufferCommands: true,
      bufferMaxEntries: 0,
      // Auto index creation
      autoIndex: false,
    });
    
    console.log("Connected to database!");
    
    // Handle connection events for better monitoring
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (err) {
    console.log("Some error occurred while connecting to database:", err);
    process.exit(1);
  }
};

export default dbConnection;
