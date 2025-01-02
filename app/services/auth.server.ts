import { Authenticator } from "remix-auth";
import { totpStrategy } from "./strategies.server";
import type { User } from "~/db/schema";

export const authenticator = new Authenticator<User>();
authenticator.use(totpStrategy);