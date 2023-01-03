import { getCookie, setCookie } from "@lib/cookies";
import { getAccessToken, GoodreadsRequestToken } from "@lib/goodreads";
import { NextApiHandler } from "next";

const Authorize: NextApiHandler = async (req, res) => {
  try {
    const goodreadsRequestToken = await getCookie<GoodreadsRequestToken>(
      req,
      "goodreadsRequestToken"
    );
    if (!goodreadsRequestToken) {
      throw new Error("Request token not set!");
    }

    const { oAuthToken, oAuthTokenSecret } = goodreadsRequestToken;
    const token = await getAccessToken(oAuthToken, oAuthTokenSecret);
    await setCookie(res, "goodreadsAccessToken", token);

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
