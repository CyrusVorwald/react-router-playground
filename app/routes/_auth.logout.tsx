import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/_auth.logout";
import { redirect } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export default function LogoutRoute() {
  return null;
}