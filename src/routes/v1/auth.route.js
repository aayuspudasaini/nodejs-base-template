const { Router } = require("express");
const { AuthController } = require("../../controller");
const { identifier } = require("../../middlewares/identification");
const router = Router();

router.route("/signin").post(AuthController.signin);

router.route("/signup").post(AuthController.signup);

router.route("/signout").post(identifier, AuthController.signOut);

router.patch(
  "/send-verification-code",
  identifier,
  AuthController.sendVerificationCode
);

router.patch(
  "/verify-verification-code",
  identifier,
  AuthController.verifyVerificationCode
);

router.patch("/change-password", identifier, AuthController.changePassword);

router.patch(
  "/send-forget-password-code",
  AuthController.sendForgetPasswordCode
);

router.patch(
  "/verify-forget-password-code",
  AuthController.VerifyForgetPasswordCode
);

module.exports = router;
