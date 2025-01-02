import { redirect } from "react-router";
import { useFetcher } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { getSession } from "~/services/session.server";
import { authenticator } from "~/services/auth.server";
import type { Route } from "./+types/_auth.login";

export async function loader({ request }: Route.LoaderArgs) {
  // Check if user is already authenticated
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  
  // If they're already logged in, redirect to dashboard
  if (user) {
    return redirect("/dashboard");
  }
  
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    return await authenticator.authenticate("TOTP", request);
  } catch (error) {
    // The error from TOTP includes the redirect Response with the cookie
    if (error instanceof Response) {
      return error;
    }

    // For other errors, return with error message
    return { 
      error: "An error occurred during login. Please try again." 
    };
  }
}

export default function LoginPage() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle" || fetcher.formData != null;
  const errors = fetcher.data?.error;
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your email to receive a login code</CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            {errors && (
              <Alert variant="destructive">
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Input 
                type="email" 
                name="email" 
                placeholder="Enter your email"
                required 
                disabled={isSubmitting}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Continue with Email"}
            </Button>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}