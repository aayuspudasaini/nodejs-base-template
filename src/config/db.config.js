const mongoose = require("mongoose");

const connectDB = async (URI) => {
  try {
    const { connection } = await mongoose.connect(`${URI}`);
    console.log(`MongoDB Connected to: ${connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
