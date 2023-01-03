import { seal, unseal, defaults } from "@hapi/iron";
import { NextApiRequest, NextApiResponse } from "next";

const secret = process.env.SESSION_PASSWORD ?? "";

export const setCookie = async <T>(
  res: NextApiResponse,
  name: string,
  value: T,
  ttl: number = 2147483647
) => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + ttl);
  const sealed = await seal(value, secret, defaults);
  const secure = process.env.NODE_ENV === "production" ? ";secure" : "";

  res.setHeader(
    "Set-Cookie",
    `${name}=${sealed};expires=${expirationDate.toUTCString()};path=/;SameSite=Strict${secure}`
  );
};

export const getCookie = async <T>(
  req: NextApiRequest,
  name: string
): Promise<T | null> => {
  const cookieValue = req.cookies[name];
  if (!cookieValue) {
    return null;
  }
  const unsealed: T = await unseal(cookieValue, secret, defaults);
  return unsealed;
};
