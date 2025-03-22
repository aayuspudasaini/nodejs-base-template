const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(32, function (err, byte) {
      const fn = byte.toString("hex") + path.extname(file.originalname);
      cb(null, fn);
    });
  },
});

// filtering File Types

exports.upload = multer({ storage });
