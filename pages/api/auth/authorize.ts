import withSession from "@lib/withSession";
import { getAccessToken } from "@lib/goodreads";

export default withSession(async (req, res) => {
  try {
    if (!req.session.goodreadsRequestToken) {
      throw new Error("Request token not set!");
    }
    const { oAuthToken, oAuthTokenSecret } = req.session.goodreadsRequestToken;
    const token = await getAccessToken(oAuthToken, oAuthTokenSecret);
    req.session.goodreadsAccessToken = token;
    await req.session.save();

    res.status(200).send("");
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
};
