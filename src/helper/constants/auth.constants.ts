const Auth = Object.freeze({
  MESSAGES: {
    OTP_FAILED: "Sending otp for user verification failed",
    OTP_VERIFICATION_FAILED: "Otp verification failed",
    INCORRECT_CREDENTIALS: "Incorrect email or password",
    AUTHENTICATE: "Please authenticate",
    PASSWORD_RESET_FAILED: "Password reset failed",
    EMAIL_VERIFICATION_FAILED: "Email verification failed",
    OTP_NOT_MATCHED: "Otp didn't matched",
    REFRESH_TOKEN_FAILURE: "Failed to refresh tokens",
    FORGOT_PASSWORD_FAILURE: "Forgot password request failed",
    RESET_PASSWORD_FAILURE: "Reset password request failed",
    SENDING_VERIFICATION_EMAIL_FAILURE:
      "Sending verification email request failed",
    EMAIL_VERIFICATION_FAILURE: "Email verification failed",
  },
});

export { Auth };
