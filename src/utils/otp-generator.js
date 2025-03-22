const crypto = require("crypto");

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const generateOtp = (length) => {
  let otp = "";
  for (let i = 0; i <= length; i++) {
    otp += numbers[crypto.randomInt(numbers.length)];
  }
  return otp;
};

module.exports = { generateOtp };
