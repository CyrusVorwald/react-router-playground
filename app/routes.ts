import {
  type RouteConfig,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./routes/_auth.tsx", [
    route("login", "./routes/_auth.login.tsx"),
    route("logout", "./routes/_auth.logout.tsx"),
    route("verify", "./routes/_auth.verify.tsx"),
  ]),
  layout("./routes/_dashboard.tsx", [
    route("dashboard", "./routes/_dashboard.dashboard.tsx"),
  ]),
] satisfies RouteConfig;
