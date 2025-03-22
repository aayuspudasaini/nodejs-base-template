const {
  signUpScehema,
  signInSchema,
  emailVerifySchema,
  changePasswordSchema,
  ForgetPasswordVerifySchema,
} = require("../middlewares/validator");
const { hash } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { config } = require("@config");
const { transport } = require("../middlewares/index.js");
const {
  hmacProcess,
  comparePassword,
  makePassword,
} = require("../utils/hashing.js");

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = signInSchema.validate({ email, password });

    if (error)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, error: error.details[0].message });

    // checking if user exists or not
    const isExist = await User.findOne({ email }).select("+password");

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "The credentials provided didn't match",
      });

    // checking if password is correct or not
    const isMatch = await hash.comparePassword(password, isExist.password);

    if (!isMatch)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "The credentials provided didn't match",
      });

    const token = jwt.sign(
      { id: isExist._id, email: isExist.email, verified: isExist.verified },
      config.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "User Logged In Successfully",
      data: {
        isExist,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { error, value } = signUpScehema.validate({ name, email, password });

    if (error)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, error: error.details[0].message });

    // checking if user exists or not
    const isExist = await User.findOne({ email });

    if (isExist)
      return res
        .status(StatusCodes.CONFLICT)
        .json({ success: false, message: "User already exists" });

    // creating new user
    const hashPassword = await hash.makePassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User Created Successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.signOut = async (req, res) => {
  res.clearCookie("Authorization").status(StatusCodes.OK).json({
    success: true,
    message: "User Logged Out Successfully",
  });
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // checking if user exists or not
    const isExist = await User.findOne({ email });

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User doesn't exist",
      });

    if (isExist.verified)
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User is already verified",
      });

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transport.sendMail({
      from: config.SMTP_EMAIL,
      to: isExist.email,
      subject: "Verification Code",
      html: `<h1>Your Verification Code is ${codeValue}</h1>`,
    });

    if (info.accepted[0] === isExist.email) {
      const hashedCodeValue = hash.hmacProcess(codeValue, config.HMAC_SECRET);

      isExist.verificationCode = hashedCodeValue;

      isExist.verificationCodeValidation = Date.now();

      await isExist.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Verification Code Sent Successfully",
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to send verification code",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.verifyVerificationCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const { error, value } = emailVerifySchema.validate({
      email,
      code,
    });

    if (error)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, error: error.details[0].message });

    // checking if user exists or not
    const isExist = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User doesn't exist",
      });

    // checking if user is verified or not
    if (isExist.verified)
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "User is already verified",
      });

    if (!isExist.verificationCodeValidation || !isExist.verificationCode)
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        message: "Something went wrong.",
      });

    //checking if code is expired or not
    if (Date.now() - isExist.verificationCodeValidation > 5 * 60 * 1000) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        message: "Verification code expired",
      });
    }

    // checking if code is valid
    const hashedCodeValue = hmacProcess(code.toString(), config.HMAC_SECRET);

    if (hashedCodeValue === isExist.verificationCode) {
      isExist.verified = true;
      isExist.verificationCode = undefined;
      isExist.verificationCodeValidation = undefined;
      await isExist.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Account has been verified",
      });
    }

    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      message: "Something went wrong.",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { id, verified } = req.user;
  const { old_password, new_password, confirm_new_password } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      old_password,
      new_password,
      confirm_new_password,
    });

    if (error)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, error: error.details[0].message });

    if (!verified)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "User is not verified",
      });

    const isExist = await User.findById({ _id: id }).select("+password");

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User doesn't exist",
      });

    const result = await comparePassword(old_password, isExist.password);
    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    const hashedNewPassword = await makePassword(new_password);
    isExist.password = hashedNewPassword;
    await isExist.save();
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Password has been changed successfully ",
    });
  } catch (err) {
    console.log(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.sendForgetPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    // checking if user exists or not
    const isExist = await User.findOne({ email });

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User doesn't exist",
      });

    const codeValue = Math.floor(Math.random() * 1000000).toString();

    let info = await transport.sendMail({
      from: config.SMTP_EMAIL,
      to: isExist.email,
      subject: "Forget Password Code",
      html: `<h1>Your Code is ${codeValue}</h1>`,
    });

    if (info.accepted[0] === isExist.email) {
      const hashedCodeValue = hash.hmacProcess(codeValue, config.HMAC_SECRET);

      isExist.forgetPasswordCode = hashedCodeValue;

      isExist.forgetPasswordValidation = Date.now();

      await isExist.save();

      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Code Sent Successfully",
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to send code",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.VerifyForgetPasswordCode = async (req, res) => {
  const { email, code, new_password } = req.body;
  try {
    const { error, value } = ForgetPasswordVerifySchema.validate({
      email,
      code,
      new_password,
    });

    if (error)
      return res
        .status(StatusCodes.NOT_ACCEPTABLE)
        .json({ success: false, error: error.details[0].message });

    // checking if user exists or not
    const isExist = await User.findOne({ email }).select(
      "+forgetPasswordCode +forgetPasswordValidation"
    );

    if (!isExist)
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User doesn't exist",
      });

    if (!isExist.forgetPasswordValidation || !isExist.forgetPasswordCode) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({
        success: false,
        message: "Something went wrong.",
      });
    }

    const hashedCode = hmacProcess(code.toString(), config.HMAC_SECRET);

    if (hashedCode === isExist.forgetPasswordCode) {
      isExist.forgetPasswordCode = undefined;
      isExist.forgetPasswordValidation = undefined;
      isExist.password = await makePassword(new_password);
      await isExist.save();
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password has been changed successfully",
      });
    }

    return res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      message: "Something went wrong.",
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
