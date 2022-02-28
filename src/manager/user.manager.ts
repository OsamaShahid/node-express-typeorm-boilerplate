import { User } from "../models/user.model";
import { UserHandler } from "../dbhandler/user.handler";
import { ApplicationException } from "../helper/exceptions/application.exception";
import { ResponseCodes, UserConstants } from "../helper/constants";
import { logger } from "../helper";

export class UserManager {
  /**
   * Create a user
   * @param {Object} userBody
   * @returns {Promise<User>}
   */
  static async createUser(userBody: any): Promise<User> {
    try {
      if (await User.isEmailTaken(userBody.email)) {
        throw new ApplicationException(
          UserConstants.MESSAGES.EMAIL_TAKEN,
          ResponseCodes.BAD_REQUEST
        ).toJson();
      }

      return UserHandler.saveNewUser(userBody);
    } catch (error) {
      logger.error(`createUser:: Creating user failed. error:: `, error);
      throw error;
    }
  }

  static getUserByEmail(email: string) {
    return UserHandler.getUserByEmail(email);
  }

  static getUserById(id: string) {
    return UserHandler.getUserById(id);
  }

  /**
   * Update user by id
   * @param {ObjectId} userId
   * @param {Object} updateBody
   * @returns {Promise<User>}
   */
  static async updateUserById(userId: string, updateBody: any) {
    const user = await UserManager.getUserById(userId);
    if (!user) {
      throw new ApplicationException(
        UserConstants.MESSAGES.NOT_FOUND,
        ResponseCodes.DOCUMENT_NOT_FOUND
      ).toJson();
    }
    if (
      updateBody.email &&
      (await User.isEmailTaken(updateBody.email, userId))
    ) {
      throw new ApplicationException(
        UserConstants.MESSAGES.EMAIL_TAKEN,
        ResponseCodes.BAD_REQUEST
      ).toJson();
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  }

  /**
   * Delete user by id
   * @param {ObjectId} userId
   * @returns {Promise<User>}
   */
  static async deleteUserById(userId: string) {
    const user = await UserHandler.getUserById(userId);
    if (!user) {
      throw new ApplicationException(
        UserConstants.MESSAGES.NOT_FOUND,
        ResponseCodes.DOCUMENT_NOT_FOUND
      ).toJson();
    }
    await user.remove();
    return user;
  }
}
