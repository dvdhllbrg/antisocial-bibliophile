import withSession from '@lib/withSession';
import { getRequestToken, callbackUrl } from '@lib/goodreads';

export default withSession(async (req, res) => {
  try {
    const token = await getRequestToken();
    req.session.set('goodreads', token);
    await req.session.save();

    res.status(200).json({
      oAuthUrl: `${process.env.GOODREADS_URL}/oauth/authorize?oauth_token=${token.oAuthToken}&oauth_callback=${callbackUrl}`,
    });
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
