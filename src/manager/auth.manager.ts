const otpGenerator = require("otp-generator");
import { UserManager, TokenManager, OtpManager } from "./index";
import { ApplicationException } from "../helper/exceptions/application.exception";
import { TokenEnums } from "../helper/enums";
import {
  ResponseCodes,
  AuthConstants,
  TokenConstants,
  UserConstants,
} from "../helper/constants";
import { logger } from "../helper";

export class AuthManager {
  /**
   * Login with username and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<User>}
   */
  static async loginUserWithEmailAndPassword(email: string, password: string) {
    const user = await UserManager.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApplicationException(
        AuthConstants.MESSAGES.INCORRECT_CREDENTIALS,
        ResponseCodes.UNAUTHORIZED
      ).toJson();
    }
    return user;
  }

  /**
   * Logout
   * @param {string} refreshToken
   * @returns {Promise}
   */
  static async logout(refreshToken: string) {
    const refreshTokenObj = await TokenManager.getValidTokenByType(
      refreshToken,
      TokenEnums.tokenTypes.REFRESH
    );
    if (!refreshTokenObj) {
      throw new ApplicationException(
        TokenConstants.MESSAGES.NOT_FOUND,
        ResponseCodes.DOCUMENT_NOT_FOUND
      ).toJson();
    }
    await refreshTokenObj.remove();
  }

  /**
   * Refresh auth tokens
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  static async refreshAuth(refreshToken: string) {
    try {
      const refreshTokenObj = await TokenManager.verifyToken(
        refreshToken,
        TokenEnums.tokenTypes.REFRESH
      );
      const user = await UserManager.getUserById(refreshTokenObj.user);
      if (!user) {
        throw new ApplicationException(
          UserConstants.MESSAGES.NOT_FOUND,
          ResponseCodes.DOCUMENT_NOT_FOUND
        ).toJson();
      }
      const accessToken = await TokenManager.generateAndSaveAccessToken(user);
      return { access: accessToken, refresh: { token: refreshToken } };
    } catch (error) {
      throw new ApplicationException(
        AuthConstants.MESSAGES.AUTHENTICATE,
        ResponseCodes.UNAUTHORIZED
      ).toJson();
    }
  }

  /**
   * Reset password
   * @param {string} resetPasswordToken
   * @param {string} newPassword
   * @returns {Promise}
   */
  static async resetPassword(resetPasswordToken: any, newPassword: string) {
    try {
      const resetPasswordTokenObj = await TokenManager.verifyToken(
        resetPasswordToken,
        TokenEnums.tokenTypes.RESET_PASSWORD
      );
      const user = await UserManager.getUserById(resetPasswordTokenObj.user);
      if (!user) {
        throw new ApplicationException(
          UserConstants.MESSAGES.NOT_FOUND,
          ResponseCodes.DOCUMENT_NOT_FOUND
        ).toJson();
      }
      await UserManager.updateUserById(user.id, { password: newPassword });
      await TokenManager.deleteUserTokensByType({
        user: user.id,
        type: TokenEnums.tokenTypes.RESET_PASSWORD,
      });
    } catch (error) {
      throw new ApplicationException(
        AuthConstants.MESSAGES.PASSWORD_RESET_FAILED,
        ResponseCodes.UNAUTHORIZED
      ).toJson();
    }
  }

  /**
   * Verify email
   * @param {string} verifyEmailToken
   * @returns {Promise}
   */
  static async verifyEmail(verifyEmailToken: any) {
    try {
      const verifyEmailTokenObj = await TokenManager.verifyToken(
        verifyEmailToken,
        TokenEnums.tokenTypes.VERIFY_EMAIL
      );
      const user = await UserManager.getUserById(verifyEmailTokenObj.user);
      if (!user) {
        throw new ApplicationException(
          UserConstants.MESSAGES.NOT_FOUND,
          ResponseCodes.DOCUMENT_NOT_FOUND
        ).toJson();
      }
      await TokenManager.deleteUserTokensByType({
        user: user.id,
        type: TokenEnums.tokenTypes.VERIFY_EMAIL,
      });
      await UserManager.updateUserById(user.id, { isEmailVerified: true });
    } catch (error) {
      throw new ApplicationException(
        AuthConstants.MESSAGES.EMAIL_VERIFICATION_FAILED,
        ResponseCodes.UNAUTHORIZED
      ).toJson();
    }
  }

  static async generateOtp(user: any) {
    try {
      logger.info(
        `generateAndSendOtp:: Request to generate otp code for user:: `,
        user.email
      );

      const otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const otpTokenObj = await TokenManager.generateAndSaveOtpToken(user, otp);
      logger.success(
        `generateAndSendOtp:: Successfully generated otp:: ${otp} and for user:: ${user.email}`
      );
      return { otpToken: otpTokenObj, otp };
    } catch (error) {
      logger.info(
        `generateAndSendOtp:: Request to generate otp code for user:: ${user.email} failed`,
        error
      );
      throw error;
    }
  }

  static async sendOtp(user: any, otp: string) {
    try {
      logger.info(
        `sendOtp:: Request to send otp:: ${otp} code for user:: ${user.email} on mobile:: ${user.mobile}`
      );
      await OtpManager.sendOtp(user, otp);
      logger.success(
        `sendOtp:: Successfully sent otp:: ${otp} for user:: ${user.email} on mobile:: ${user.mobile}`
      );
    } catch (error) {
      logger.info(
        `sendOtp:: Request to send otp code for user:: ${user.email} failed`,
        error
      );
      throw error;
    }
  }

  /**
   * Verify otp
   * @param {string} verifyOtpToken
   * @param {string} otp
   * @returns {Promise}
   */
  static async verifyOtp(user: any, verifyOtpToken: string, otp: string) {
    try {
      logger.info(
        `verifyOtp:: Request to verify otp:: ${otp}, token:: ${verifyOtpToken}, for user:: ${user.email}`
      );
      const verifyOtpTokenObj = await TokenManager.verifyToken(
        verifyOtpToken,
        TokenEnums.tokenTypes.OTP,
        otp
      );
      const tokenUser = await UserManager.getUserById(verifyOtpTokenObj.user);
      if (!tokenUser) {
        throw new ApplicationException(
          UserConstants.MESSAGES.NOT_FOUND,
          ResponseCodes.DOCUMENT_NOT_FOUND
        ).toJson();
      }
      await TokenManager.deleteUserTokensByType({
        user: tokenUser.id,
        type: TokenEnums.tokenTypes.OTP,
      });

      logger.success(
        `verifyOtp:: Successfully verified otp:: ${otp}, token:: ${verifyOtpToken}, for user:: ${user.email}`
      );
    } catch (error) {
      logger.error(
        `verifyOtp:: Failed to verify otp:: ${otp}, token:: ${verifyOtpToken}, for user:: ${user.email}`,
        error
      );
      throw error;
    }
  }
}
