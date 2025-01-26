import mongoose from "mongoose";
const connection = {};
const connectMongoDb = async () => {
  try {
    if (connection.isConnected) {
      return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDb;
