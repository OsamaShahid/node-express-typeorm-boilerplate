import express from "express";
import { auth } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { authValidation } from "../../helper/validations";
import { AuthController } from "../../controller";

const router = express.Router({
  mergeParams: true,
});

router.post(
  "/register",
  validate(authValidation.register),
  AuthController.register
);
router.post("/login", validate(authValidation.login), AuthController.login);
router.post("/logout", validate(authValidation.logout), AuthController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  AuthController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  AuthController.resetPassword
);
router.post(
  "/send-verification-email",
  auth(),
  AuthController.sendVerificationEmail
);
router.post(
  "/verify-email",
  validate(authValidation.verifyEmail),
  AuthController.verifyEmail
);
router.post("/generate-otp", auth(), AuthController.sendOtp);
router.post("/verify-otp", auth(), AuthController.verifyOtp);

export { router as AuthRoutes };
