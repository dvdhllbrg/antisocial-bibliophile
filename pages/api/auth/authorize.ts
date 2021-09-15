import withSession from '@lib/withSession';
import { getAccessToken } from '@lib/goodreads';

export default withSession(async (req, res) => {
  const { oAuthToken, oAuthTokenSecret } = req.session.get('goodreads');
  try {
    const token = await getAccessToken(oAuthToken, oAuthTokenSecret);
    req.session.set('goodreads', {
      oAuthToken,
      oAuthTokenSecret,
      ...token,
    });
    await req.session.save();

    res.status(200).send('');
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
