import { GenericException } from "./generic.exception";

export class ApplicationException extends GenericException {
  constructor(message: string, code = 400, meta = {}) {
    super(message, code, meta);
  }
}
