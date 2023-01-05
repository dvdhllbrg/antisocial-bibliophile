import { seal, unseal, defaults } from "@hapi/iron";
import { NextApiRequest, NextApiResponse } from "next";

const secret = process.env.SESSION_PASSWORD ?? "";
const TTL = 2147483647;

type CookieOption = {
  name: string;
  value: any;
  sealed?: boolean;
};

const bakeCookie = async ({ name, value, sealed }: CookieOption) => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + TTL);
  const secure = process.env.NODE_ENV === "production" ? ";secure" : "";
  const cookieValue = sealed ? await seal(value, secret, defaults) : value;

  return `${name}=${cookieValue};expires=${expirationDate.toUTCString()};path=/;SameSite=Lax${secure}`;
};

export const setCookies = async (
  res: NextApiResponse,
  cookieOptions: CookieOption[]
) => {
  const cookies = await Promise.all(cookieOptions.map(bakeCookie));
  res.setHeader("Set-Cookie", cookies);
};

export const getCookie = async <T>(
  req: NextApiRequest,
  name: string,
  sealed: boolean = false
): Promise<T | null> => {
  const cookieValue = req.cookies[name];
  if (!cookieValue) {
    return null;
  }
  const cookie: T = sealed
    ? await unseal(cookieValue, secret, defaults)
    : cookieValue;
  return cookie;
};
