const nodemailer = require("nodemailer");

const { SMTP_EMAIL, SMTP_PASSWORD } = require("../config/server.config");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
});

module.exports = transport;
