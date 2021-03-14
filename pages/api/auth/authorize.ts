import { withIronSession } from 'next-iron-session';
import { getAccessToken } from '../../../lib/goodreads';

async function handler(req, res) {
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
    res.status(500).json({ msg: err.data });
  }
}

export default withIronSession(handler, {
  cookieName: 'session',
  password: process.env.SESSION_PASSWORD,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});

export const config = {
  api: {
    externalResolver: true,
  },
};
