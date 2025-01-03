import { TOTPStrategy } from "remix-auth-totp";
import { sendMagicLinkEmail } from "./email.server";
import { getOrCreateUser } from "./user.server";
import { commitSession, getSession } from "./session.server";
import { redirect } from "react-router";
import { AUTH_ERRORS } from "~/constants/auth";

export const totpStrategy = new TOTPStrategy(
  {
    secret: process.env.TOTP_SECRET!, // Make sure to set this in your environment variables
    maxAge: 60 * 10, // 10 minutes
    totpGeneration: {
      digits: 6,
      charSet: '0123456789',
      period: 300, // 5 minutes
      algorithm: "SHA-256",
    },
    customErrors: {
      requiredEmail: AUTH_ERRORS.REQUIRED_EMAIL,
      invalidEmail: AUTH_ERRORS.INVALID_EMAIL,
      invalidTotp: AUTH_ERRORS.INVALID_TOTP,
      expiredTotp: AUTH_ERRORS.EXPIRED_TOTP,
      missingSessionEmail: AUTH_ERRORS.MISSING_SESSION_EMAIL,
      missingSessionTotp: AUTH_ERRORS.MISSING_SESSION_TOTP,
      rateLimitExceeded: AUTH_ERRORS.RATE_LIMIT_EXCEEDED,
    },
    magicLinkPath: "/verify",
    emailSentRedirect: "/verify",
    successRedirect: "/dashboard",
    failureRedirect: "/verify",
    sendTOTP: async ({ email, code, magicLink }) => {
      await sendMagicLinkEmail({ email, code, magicLink });
    },
  },
  async ({ email, request }) => {
    const user = await getOrCreateUser(email);
    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", user);

    const sessionCookie = await commitSession(session);

    throw redirect("/dashboard", {
      headers: {
        "Set-Cookie": sessionCookie,
      },
    });
  }
);
