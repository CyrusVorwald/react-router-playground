import { redirect, useLoaderData } from "react-router";
import { Cookie } from "@mjackson/headers";
import { Link, useFetcher } from "react-router";
import * as jose from "jose";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { useState } from "react";
import { getSession } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/_auth.verify";
import { asJweKey } from "~/lib/utils";
import WrongBrowserNotice from "~/components/auth/wrong-browser-notice";
import ExpiredLinkNotice from "~/components/auth/expired-link-notice";
import { AUTH_ERRORS } from "~/constants/auth";
import RateLimitedNotice from "~/components/auth/rate-limited-notice";
import InvalidSessionNotice from "~/components/auth/invalid-session-notice";

export async function loader({ request }: Route.LoaderArgs) {
  // Check if user is already authenticated
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  // If they're already logged in, redirect to dashboard
  if (user) {
    return redirect("/dashboard");
  }

  const cookie = new Cookie(request.headers.get("Cookie") || "");
  const totpCookie = cookie.get("_totp");

  // If this is a magic link verification (GET with token)
  const url = new URL(request.url);
  const token = url.searchParams.get("t");

  if (token) {
    try {
      // Decrypt the token using the same method as the strategy
      const { plaintext } = await jose.compactDecrypt(
        token,
        asJweKey(process.env.TOTP_SECRET!)
      );
      const params = JSON.parse(new TextDecoder().decode(plaintext));

      if (
        !params?.code ||
        !params?.expires ||
        typeof params.expires !== "number"
      ) {
        return { error: AUTH_ERRORS.INVALID_MAGIC_LINK };
      }

      // Check if the link has expired
      if (Date.now() > params.expires) {
        return { error: AUTH_ERRORS.EXPIRED_TOTP };
      }

      // Check if the user is accessing from another browser
      if (!totpCookie) {
        return { differentBrowser: true, code: params.code };
      }
    } catch (error) {
      return { error: AUTH_ERRORS.INVALID_MAGIC_LINK };
    }

    try {
      return await authenticator.authenticate("TOTP", request);
    } catch (error) {
      if (error instanceof Response) return error;
      if (error instanceof Error) return { error: error.message };
      return { error: AUTH_ERRORS.INVALID_TOTP };
    }
  }

  // Get the email from the TOTP cookie if it exists
  let email = null;
  if (totpCookie) {
    const params = new URLSearchParams(totpCookie);
    email = params.get("email");
  }

  if (!email) {
    return redirect("/login");
  }

  return { email };
}

// Action handles manual code entry via POST
export async function action({ request }: Route.ActionArgs) {
  try {
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    if (error instanceof Response) return error;
    return { error: AUTH_ERRORS.INVALID_TOTP };
  }
}

export default function VerifyPage() {
  const loaderData = useLoaderData<typeof loader>();

  console.log(loaderData);

  const code = "code" in loaderData ? loaderData.code : undefined;
  const email = "email" in loaderData ? loaderData.email : undefined;
  const error = "error" in loaderData ? loaderData.error : null;

  switch (error) {
    case AUTH_ERRORS.RATE_LIMIT_EXCEEDED: {
      return <RateLimitedNotice />;
    }
    case AUTH_ERRORS.MISSING_SESSION_EMAIL:
    case AUTH_ERRORS.MISSING_SESSION_TOTP: {
      if (code) {
        return <WrongBrowserNotice code={code} />;
      }
      return <InvalidSessionNotice />;
    }
    case AUTH_ERRORS.EXPIRED_TOTP: {
      return <ExpiredLinkNotice />;
    }
  }

  const [value, setValue] = useState("");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;
  const errors = fetcher.data?.error || error;

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            {email ? (
              <>We sent a code to {email}</>
            ) : (
              <>Check your email for a verification code</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code sent to your email to sign in
            </p>
            <fetcher.Form method="post" className="space-y-4">
              <input type="hidden" name="code" value={value} />
              <InputOTP
                maxLength={6}
                value={value}
                onChange={setValue}
                disabled={isSubmitting}
              >
                <InputOTPGroup className="gap-2 flex-nowrap">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSeparator />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || value.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>
            </fetcher.Form>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn't receive the code? Check your spam folder or try again.
            </p>
            <div className="flex justify-center">
              <Button variant="ghost" asChild>
                <Link to="/login">Try Different Email</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
