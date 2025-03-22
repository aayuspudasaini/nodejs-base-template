const { getEnv } = require("@utils");

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", 3000),

  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI", ""),

  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:3000"),
});

module.exports.config = { appConfig };
