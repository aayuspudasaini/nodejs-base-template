const jwt = require("jsonwebtoken");
const serverConfig = require("../config/server.config");

exports.identifier = (req, res, next) => {
  let token;

  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }

  try {
    const userToken = token.split(" ")[1];

    const jwtVerify = jwt.verify(userToken, serverConfig.JWT_SECRET);

    if (jwtVerify) {
      req.user = jwtVerify;
      next();
    } else {
      throw new Error("Invalid Token");
    }
  } catch (error) {
    console.log(error);
  }
};
