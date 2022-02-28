import { GenericException } from "./generic.exception";

export class AuthException extends GenericException {
  constructor(message: string, code = 401, meta = {}) {
    super(message, code, meta);
  }
}
