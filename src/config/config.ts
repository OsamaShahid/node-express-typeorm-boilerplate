import dotenv from "dotenv";
import path from "path";
import { configValidation } from "../helper/validations";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const { value: envVars, error } = configValidation
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const serverConfig = {
  env: envVars.NODE_ENV,
  project_root: envVars.PROJECT_ROOT,
  port: envVars.PORT,
  host: envVars.HOST,
  protocol: envVars.PROTOCOL,
  server_timeout: envVars.SERVER_TIMEOUT,
  keep_alive_timeout: envVars.KEEP_ALIVE_TIMEOUT,
  header_timeout: envVars.HEADER_TIMEOUT,

  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  twilio: {
    auth: {
      sid: envVars.TWILIO_ACCOUNT_SID,
      token: envVars.TWILIO_ACCOUNT_TOKEN,
    },
    number: envVars.TWILIO_PHONE_NUMBER,
  },
};

export { serverConfig as config };
