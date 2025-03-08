const { mongoose } = require("mongoose");

const connect = async (MONGO_URI) => {
  try {
    const { connection } = await mongoose.connect(`${MONGO_URI}`);
    console.log(`MongoDB Connected to: ${connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { connect };
