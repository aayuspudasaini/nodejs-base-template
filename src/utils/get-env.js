const dotenv = require("dotenv");

dotenv.config(); // load .env file

exports.getEnv = (key, defaultValue = "") => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
