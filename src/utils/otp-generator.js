const { crypto } = require("crypto");

const generateOTP = () => {
  return crypto.randomBytes(6).toString("hex");
};

module.exports = generateOTP;
