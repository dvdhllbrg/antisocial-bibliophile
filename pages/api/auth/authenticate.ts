import { getRequestToken, callbackUrl } from "@lib/goodreads";
import { NextApiHandler } from "next";
import { setCookies } from "@lib/cookies";

const Authenticate: NextApiHandler = async (_, res) => {
  try {
    const token = await getRequestToken();
    await setCookies(res, [
      {
        name: "goodreadsRequestToken",
        value: token,
        sealed: true,
      },
    ]);

    res.status(200).json({
      oAuthUrl: `${process.env.GOODREADS_URL}/oauth/authorize?oauth_token=${token.oAuthToken}&oauth_callback=${callbackUrl}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

export default Authenticate;

export const config = {
  api: {
    externalResolver: true,
  },
};
