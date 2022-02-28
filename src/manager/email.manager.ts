import nodemailer from "nodemailer";
import { config } from "../config/config";
const transport = nodemailer.createTransport(config.email.smtp);

export class MailManager {
  /**
   * Send an email
   * @param {string} to
   * @param {string} subject
   * @param {string} text
   * @returns {Promise}
   */
  static async sendEmail(to: string, subject: string, text: string) {
    const msg: any = { from: config.email.from, to, subject, text };
    await transport.sendMail(msg);
  }

  /**
   * Send reset password email
   * @param {string} to
   * @param {string} token
   * @returns {Promise}
   */
  static async sendResetPasswordEmail(to: string, token: string) {
    const subject = "Reset password";
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
        To reset your password, click on this link: ${resetPasswordUrl}
        If you did not request any password resets, then ignore this email.`;
    await MailManager.sendEmail(to, subject, text);
  }

  /**
   * Send verification email
   * @param {string} to
   * @param {string} token
   * @returns {Promise}
   */
  static async sendVerificationEmail(to: string, token: string) {
    const subject = "Email Verification";
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
        To verify your email, click on this link: ${verificationEmailUrl}
        If you did not create an account, then ignore this email.`;
    await MailManager.sendEmail(to, subject, text);
  }
}
