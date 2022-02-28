const Token = Object.freeze({
  tokenTypes: {
    ACCESS: 1, // access
    REFRESH: 2, // refresh
    RESET_PASSWORD: 3, // reset-password
    VERIFY_EMAIL: 4, // verify-email
    OTP: 5, // otp
  },
});

export { Token };
