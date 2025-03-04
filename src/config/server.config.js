const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/test",
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
};
