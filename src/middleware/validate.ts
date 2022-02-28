import Joi from "joi";
import httpStatus from "http-status";
import { pick } from "../helper";
import { ApplicationException } from "../helper/exceptions/application.exception";

const validate = (schema: any) => (req: any, res: any, next: any) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApplicationException(errorMessage, httpStatus.BAD_REQUEST));
  }
  Object.assign(req, value);
  return next();
};

export { validate };
