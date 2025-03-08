const { config } = require("./app.config");

module.exports = {
  config,
  db: require("./db.config"),
  exp: require("./express.config"),
};
