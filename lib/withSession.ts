import { NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { GoodreadsAccessToken, GoodreadsRequestToken } from "./goodreads";

declare module "iron-session" {
  interface IronSessionData {
    goodreadsRequestToken?: GoodreadsRequestToken;
    goodreadsAccessToken?: GoodreadsAccessToken;
    userId?: string;
  }
}

export default function withSession(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, {
    password: process.env.SESSION_PASSWORD || "",
    cookieName: "session",
    ttl: 0,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}
