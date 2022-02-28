import passport from "passport";
import httpStatus from "http-status";
import { AuthException } from "../helper/exceptions/auth.exception";
import { roleRights } from "../config/roles";

const verifyCallback =
  (req: any, resolve: any, reject: any, requiredRights: any) =>
  async (err: any, user: any, info: any) => {
    if (err || info || !user) {
      return reject(
        new AuthException("Please authenticate", httpStatus.UNAUTHORIZED)
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights: any = roleRights.get(user.role);
      const hasRequiredRights = requiredRights.every((requiredRight: any) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new AuthException("Forbidden", httpStatus.FORBIDDEN));
      }
    }

    resolve();
  };

const auth =
  (...requiredRights: any[]) =>
  async (req: any, res: any, next: any) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => {
        return next(err);
      });
  };

export { auth };
