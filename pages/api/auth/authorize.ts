import { getCookie, setCookies } from "@lib/cookies";
import {
  getAccessToken,
  getAuthed,
  GoodreadsRequestToken,
} from "@lib/goodreads";
import { NextApiHandler } from "next";

const Authorize: NextApiHandler = async (req, res) => {
  try {
    const goodreadsRequestToken = await getCookie<GoodreadsRequestToken>(
      req,
      "goodreadsRequestToken",
      true
    );
    if (!goodreadsRequestToken) {
      throw new Error("Request token not set!");
    }

    const { oAuthToken, oAuthTokenSecret } = goodreadsRequestToken;
    const token = await getAccessToken(oAuthToken, oAuthTokenSecret);
    const user = await getAuthed(
      "/api/auth_user",
      token.accessToken,
      token.accessTokenSecret
    );

    await setCookies(res, [
      { name: "goodreadsAccessToken", value: token, sealed: true },
      { name: "userId", value: user.user.id },
    ]);

    res.status(200).send("");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export default Authorize;

export const config = {
  api: {
    externalResolver: true,
  },
};
