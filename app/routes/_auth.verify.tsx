import { redirect } from "react-router";
import { Cookie } from "@mjackson/headers";
import { useSearchParams, Link, useFetcher } from "react-router";
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

export async function loader({ request }: Route.LoaderArgs) {
  // Check if user is already authenticated
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  // If they're already logged in, redirect to dashboard
  if (user) {
    return redirect("/dashboard");
  }

  // If this is a magic link verification (GET with code)
  const url = new URL(request.url);
  if (url.searchParams.has("code")) {
    try {
      return await authenticator.authenticate("TOTP", request);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      // If verification fails, show error on verify page
      return { error: "Invalid or expired code. Please try again." };
    }
  }

  // Get the email from the TOTP cookie for showing in the UI
  const cookie = new Cookie(request.headers.get("Cookie") || "");
  const totpCookie = cookie.get("_totp");

  if (!totpCookie) {
    return redirect("/login");
  }

  const params = new URLSearchParams(totpCookie);
  const email = params.get("email");

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
    if (error instanceof Response) {
      return error;
    }
    return { error: "Invalid or expired code. Please try again." };
  }
}

export default function VerifyPage() {
  const [value, setValue] = useState("");
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;
  const errors = fetcher.data?.error;

  // Email can come from either search params (redirect from login)
  // or from loader data (direct navigation to verify)
  const email = searchParams.get("email");

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
