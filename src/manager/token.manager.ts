const jwt = require("jsonwebtoken");
import moment from "moment";
import { config } from "../config/config";
import { UserManager } from "./user.manager";
import { ApplicationException } from "../helper/exceptions/application.exception";
import { TokenHandler } from "../dbhandler";
import { logger } from "../helper";
import {
  AuthConstants,
  ResponseCodes,
  TokenConstants,
  UserConstants,
} from "../helper/constants";
import { TokenEnums } from "../helper/enums";

export class TokenManager {
  /**
   * Generate token
   * @param {ObjectId} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {string} opt // optional
   * @param {string} [secret]
   * @returns {string}
   */
  static generateToken(
    userId: string,
    expires: any,
    type: number,
    otp: string = "",
    secret: string = config.jwt.secret
  ) {
    const payload: any = {
      id: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    if (!!otp) {
      payload.otp = otp;
    }

    return jwt.sign(payload, secret);
  }

  /**
   * Verify token and return token object (or throw an error if it is not valid)
   * @param {string} token
   * @param {string} type
   * @param {string} opt // optional
   * @returns {Promise<Token>}
   */
  static async verifyToken(token: string, type: number, otp: string = "") {
    try {
      const payload: any = jwt.verify(token, config.jwt.secret);

      logger.info(`verifyToken:: token info:: `, {
        value: token,
        type,
        user: payload.id,
        otp: payload.otp ? payload.otp : null,
        blacklisted: false,
      });
      const tokenObj = await TokenHandler.getValidTokenByUserAndType(
        token,
        type,
        payload.id
      );
      if (!tokenObj) {
        throw new ApplicationException(
          TokenConstants.MESSAGES.NOT_FOUND,
          ResponseCodes.DOCUMENT_NOT_FOUND
        ).toJson();
      }
      if (!!otp && payload.otp !== otp) {
        throw new ApplicationException(
          AuthConstants.MESSAGES.OTP_NOT_MATCHED,
          ResponseCodes.FORBIDDEN
        ).toJson();
      }
      return tokenObj;
    } catch (error) {
      logger.error(
        `verifyToken:: Filed to verify token, error:: `,
        error
      );
      throw error;
    }
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static async generateAuthTokens(user: any) {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = TokenManager.generateToken(
      user.id,
      accessTokenExpires,
      TokenEnums.tokenTypes.ACCESS
    );

    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = TokenManager.generateToken(
      user.id,
      refreshTokenExpires,
      TokenEnums.tokenTypes.REFRESH
    );
    await TokenHandler.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      TokenEnums.tokenTypes.REFRESH
    );

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static async generateAndSaveAccessToken(user: any) {
    const accessTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const accessToken = TokenManager.generateToken(
      user.id,
      accessTokenExpires,
      TokenEnums.tokenTypes.ACCESS
    );

    return {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    };
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static async generateAndSaveRefreshToken(user: any) {
    const refreshTokenExpires = moment().add(
      config.jwt.refreshExpirationDays,
      "days"
    );
    const refreshToken = TokenManager.generateToken(
      user.id,
      refreshTokenExpires,
      TokenEnums.tokenTypes.REFRESH
    );
    await TokenHandler.saveToken(
      refreshToken,
      user.id,
      refreshTokenExpires,
      TokenEnums.tokenTypes.REFRESH
    );

    return {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    };
  }

  /**
   * Generate auth tokens
   * @param {User} user
   * @returns {Promise<Object>}
   */
  static async generateAndSaveOtpToken(user: any, otp: string) {
    const otpTokenExpires = moment().add(
      config.jwt.accessExpirationMinutes,
      "minutes"
    );
    const otpToken = TokenManager.generateToken(
      user.id,
      otpTokenExpires,
      TokenEnums.tokenTypes.OTP,
      otp
    );
    await TokenHandler.saveToken(
      otpToken,
      user.id,
      otpTokenExpires,
      TokenEnums.tokenTypes.OTP
    );

    return {
      token: otpToken,
      expires: otpTokenExpires.toDate(),
    };
  }

  /**
   * Generate reset password token
   * @param {string} email
   * @returns {Promise<string>}
   */
  static async generateAndSaveResetPasswordToken(email: string) {
    const user = await UserManager.getUserByEmail(email);
    if (!user) {
      throw new ApplicationException(
        UserConstants.MESSAGES.NO_USER_FOUND_WITH_EMAIL,
        ResponseCodes.DOCUMENT_NOT_FOUND
      ).toJson();
    }
    const expires = moment().add(
      config.jwt.resetPasswordExpirationMinutes,
      "minutes"
    );
    const resetPasswordToken = TokenManager.generateToken(
      user.id,
      expires,
      TokenEnums.tokenTypes.RESET_PASSWORD
    );
    await TokenHandler.saveToken(
      resetPasswordToken,
      user.id,
      expires,
      TokenEnums.tokenTypes.RESET_PASSWORD
    );
    return resetPasswordToken;
  }

  /**
   * Generate verify email token
   * @param {User} user
   * @returns {Promise<string>}
   */
  static async generateAndSaveVerifyEmailToken(user: any) {
    const expires = moment().add(
      config.jwt.verifyEmailExpirationMinutes,
      "minutes"
    );
    const verifyEmailToken = TokenManager.generateToken(
      user.id,
      expires,
      TokenEnums.tokenTypes.VERIFY_EMAIL
    );
    await TokenHandler.saveToken(
      verifyEmailToken,
      user.id,
      expires,
      TokenEnums.tokenTypes.VERIFY_EMAIL
    );
    return verifyEmailToken;
  }

  static getValidTokenByUserAndType(
    token: string,
    type: number,
    userId: string
  ) {
    return TokenHandler.getValidTokenByUserAndType(token, type, userId);
  }

  static getValidTokenByType(token: string, type: number) {
    return TokenHandler.getValidTokenByType(token, type);
  }

  static deleteUserTokensByType(query: any) {
    return TokenHandler.deleteUserTokensByType(query);
  }
}
