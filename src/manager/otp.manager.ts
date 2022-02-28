const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
import { logger } from "../helper";
import { config } from "../config/config";

export class OtpManager {
  static sendOtp(user: any, otp: string) {
    logger.info(
      `sendOtp:: Sending Otp:: ${otp}, to user:: ${user.email} on mobile:: ${user.mobile}`
    );
    return client.messages.create({
      body: `${otp}`,
      from: config.twilio.number,
      to: `+${user.mobile}`,
    });
  }
}
