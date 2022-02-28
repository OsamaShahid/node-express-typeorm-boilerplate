import { logger } from "../helper";
import { ApplicationException } from "../helper/exceptions/application.exception";

import { UserConstants, ResponseCodes } from "../helper/constants";

export default class AuthUtil {
  static validateOtpRequest(user: any) {
    if (!user) {
      logger.error(
        `validateGenerateAndSendOtpRequest:: Invalid user, user:: ${user}`
      );
      throw new ApplicationException(
        UserConstants.MESSAGES.INVALID_USER,
        ResponseCodes.BAD_REQUEST
      ).toJson();
    }
    if (!user.mobile) {
      logger.error(
        `validateGenerateAndSendOtpRequest:: User mobile number is not valid, user:: ${user.email}, user:: ${user.mobile}`
      );
      throw new ApplicationException(
        UserConstants.MESSAGES.INVALID_MOBILE,
        ResponseCodes.BAD_REQUEST
      ).toJson();
    }

    if (!user.is_mobile_verified) {
      logger.error(
        `validateGenerateAndSendOtpRequest:: User mobile number is not verified, user:: ${user.email}, user:: ${user.is_mobile_verified}`
      );
      throw new ApplicationException(
        UserConstants.MESSAGES.MOBILE_NOT_VERIFIED,
        ResponseCodes.BAD_REQUEST
      ).toJson();
    }
  }
}
