import mongoose from "mongoose";

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = {
    conn: null,
    promise: null,
  };
}

const connection = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables.");
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 60000,
      })
      .then((mongooseInstance) => {
        console.log("✅ Database Connected");
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }

  return cached.conn;
};

export default connection;