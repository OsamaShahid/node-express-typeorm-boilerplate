import { Token } from "../models/token.model";

export class TokenHandler {
  /**
   * Save a token
   * @param {string} token
   * @param {string} userId
   * @param {Moment} expires
   * @param {string} type
   * @param {boolean} [blacklisted]
   * @returns {Promise<Token>}
   */
  static saveToken(
    token: string,
    userId: string,
    expires: any,
    type: number,
    blacklisted: boolean = false
  ) {
    const tokenObj = new Token();

    tokenObj.value = token;
    tokenObj.user = userId;
    tokenObj.created_by = userId;
    tokenObj.updated_by = userId;
    tokenObj.type = type;
    tokenObj.black_listed = blacklisted;
    tokenObj.expires = expires.toDate();

    return tokenObj.save();
  }

  static getValidTokenByUserAndType(
    token: string,
    type: number,
    userId: string
  ) {
    const query = {
      value: token,
      type: type,
      user: userId,
      black_listed: false,
    };

    return Token.findOne(query);
  }

  static getValidTokenByType(token: string, type: number) {
    const query = {
      value: token,
      type: type,
      black_listed: false,
    };

    return Token.findOne(query);
  }

  static deleteUserTokensByType(query: any) {
    return Token.delete(query);
  }
}
