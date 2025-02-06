const bcrypt = require("bcryptjs");
const { createHmac } = require("crypto");

const makePassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};

module.exports = { makePassword, comparePassword, hmacProcess };
