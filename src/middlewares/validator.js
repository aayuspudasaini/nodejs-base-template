const Joi = require("joi");

exports.signUpScehema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(6).max(60).required().email(),
  password: Joi.string().min(8).max(25).required(),
  // .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
});

exports.signInSchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email(),
  password: Joi.string().min(8).max(25).required(),
  // .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
});

exports.emailVerifySchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email(),
  code: Joi.number().required(),
});

exports.changePasswordSchema = Joi.object({
  old_password: Joi.string().min(8).max(25).required(),
  new_password: Joi.string().min(8).max(25).required(),
  confirm_new_password: Joi.string().min(8).max(25).required(),
  // .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$")),
});

exports.ForgetPasswordVerifySchema = Joi.object({
  email: Joi.string().min(6).max(60).required().email(),
  code: Joi.number().required(),
  new_password: Joi.string().min(8).max(25).required(),
});
