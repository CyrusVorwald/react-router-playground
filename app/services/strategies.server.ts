import { TOTPStrategy } from "remix-auth-totp";
import { sendMagicLinkEmail } from "./email.server";
import { getOrCreateUser } from "./user.server";
import { commitSession, getSession } from "./session.server";
import { redirect } from "react-router";

export const totpStrategy = new TOTPStrategy(
  {
    secret: process.env.TOTP_SECRET!, // Make sure to set this in your environment variables
    maxAge: 60 * 10, // 10 minutes
    totpGeneration: {
      digits: 6,
      period: 300, // 5 minutes
      algorithm: "SHA-256",
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
