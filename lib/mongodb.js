// import mongoose from "mongoose";
// const connection = {};
// const connectMongoDb = async () => {
//   try {
//     if (connection.isConnected) {
//       return;
//     }
//     const db = await mongoose.connect(process.env.MONGODB_URI);
//     connection.isConnected = db.connections[0].readyState;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectMongoDb;

// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// 👇 Global connection cache (works in development & serverless)
let cached = global.mongoose || { conn: null, promise: null };

const connectMongoDb = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false, // prevents command buffering errors
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectMongoDb;
