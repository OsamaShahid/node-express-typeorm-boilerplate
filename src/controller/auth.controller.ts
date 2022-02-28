import httpStatus from 'http-status';
import { AuthUtil } from '../utils';
import { logger } from '../helper';
import {
  AuthManager,
  TokenManager,
  UserManager,
  MailManager,
} from "../manager";
import {
  ResponseCodes,
  UserConstants,
  AuthConstants,
} from "../helper/constants";
export class AuthController {
  static async register(req: any, res: any) {
    try {
      const user = await UserManager.createUser(req.body);
      const accessToken = await TokenManager.generateAndSaveAccessToken(user);
      const refreshToken = await TokenManager.generateAndSaveRefreshToken(user);
      const tokens = { access: accessToken, refresh: refreshToken };
      res.status(httpStatus.CREATED).json({ success: true, user, tokens });
    } catch (error) {
      logger.error(
        `register:: Request to register user failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || UserConstants.MESSAGES.USER_REG_FAILED,
      });
    }
  }

  static async login(req: any, res: any) {
    try {
      const { email, password } = req.body;
      logger.info(
        `login:: Request to login user, email:: `,
        req.body.email
      );
      const user = await AuthManager.loginUserWithEmailAndPassword(
        email,
        password
      );
      const accessToken = await TokenManager.generateAndSaveAccessToken(user);
      const refreshToken = await TokenManager.generateAndSaveRefreshToken(user);
      const tokens = { access: accessToken, refresh: refreshToken };
      logger.success(
        `login:: Successfully fulfilled request to login user, email:: `,
        req.body.email
      );
      res.json({ success: true, user, tokens });
    } catch (error) {
      logger.error(
        `login:: Request for user login failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(ResponseCodes.UNAUTHORIZED).json({
        success: false,
        message: error.message || UserConstants.MESSAGES.LOGIN_FAILURE,
      });
    }
  }

  static async logout(req: any, res: any) {
    try {
      await AuthManager.logout(req.body.refreshToken);
      res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      logger.error(
        `logout:: Request for user logout failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(ResponseCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || UserConstants.MESSAGES.LOGOUT_FAILURE,
      });
    }
  }

  static async refreshTokens(req: any, res: any) {
    try {
      const tokens = await AuthManager.refreshAuth(req.body.refreshToken);
      res.json({ success: true, ...tokens });
    } catch (error) {
      logger.error(
        `refreshTokens:: Request to refresh tokens failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || AuthConstants.MESSAGES.REFRESH_TOKEN_FAILURE,
      });
    }
  }

  static async forgotPassword(req: any, res: any) {
    try {
      const resetPasswordToken =
        await TokenManager.generateAndSaveResetPasswordToken(req.body.email);
      await MailManager.sendResetPasswordEmail(
        req.body.email,
        resetPasswordToken
      );
      res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      logger.error(
        `forgotPassword:: Request for forgot password failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message || AuthConstants.MESSAGES.FORGOT_PASSWORD_FAILURE,
      });
    }
  }

  static async resetPassword(req: any, res: any) {
    try {
      await AuthManager.resetPassword(
        req.query.token?.toString(),
        req.body.password
      );
      res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      logger.error(
        `resetPassword:: Request for reset password failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || AuthConstants.MESSAGES.RESET_PASSWORD_FAILURE,
      });
    }
  }

  static async sendVerificationEmail(req: any, res: any) {
    try {
      const verifyEmailToken =
        await TokenManager.generateAndSaveVerifyEmailToken(req.user);
      await MailManager.sendVerificationEmail(req.user.email, verifyEmailToken);
      res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      logger.error(
        `sendVerificationEmail:: Request to send verification email failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message ||
          AuthConstants.MESSAGES.SENDING_VERIFICATION_EMAIL_FAILURE,
      });
    }
  }

  static async verifyEmail(req: any, res: any) {
    try {
      await AuthManager.verifyEmail(req.query.token);
      res.status(httpStatus.NO_CONTENT).json();
    } catch (error) {
      logger.error(
        `verifyEmail:: Request to verify email failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.code || ResponseCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message:
          error.message || AuthConstants.MESSAGES.EMAIL_VERIFICATION_FAILURE,
      });
    }
  }

  static async sendOtp(req: any, res: any) {
    try {
      AuthUtil.validateOtpRequest(req.user);
      const otpObj: any = await AuthManager.generateOtp(req.user);
      await AuthManager.sendOtp(req.user, otpObj.otp);
      const tokens = { otp: otpObj.otpToken };
      res.status(httpStatus.CREATED).json({ success: true, tokens });
    } catch (error) {
      logger.error(
        `sendOtp:: Request to send otp failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res.status(error.status || error.code || ResponseCodes.BAD_REQUEST).json({
        success: false,
        message: error.message || AuthConstants.MESSAGES.OTP_FAILED,
      });
    }
  }

  static async verifyOtp(req: any, res: any) {
    try {
      await AuthManager.verifyOtp(req.user, req.query.token, req.body.otp);
      res.status(ResponseCodes.SUCCESS).json({ success: true });
    } catch (error) {
      logger.error(
        `verifyOtp:: Request to verify otp failed, data:: `,
        req.body,
        `, error:: `,
        error
      );
      res
        .status(
          error.status || error.code || ResponseCodes.INTERNAL_SERVER_ERROR
        )
        .json({
          success: false,
          message: AuthConstants.MESSAGES.OTP_VERIFICATION_FAILED,
        });
    }
  }
}
