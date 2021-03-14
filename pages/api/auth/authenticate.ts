import { withIronSession } from 'next-iron-session';
import { getRequestToken, callbackUrl } from '../../../lib/goodreads';

async function handler(req, res) {
  try {
    const token = await getRequestToken();
    req.session.set('goodreads', token);
    await req.session.save();

    res.status(200).json({
      oAuthUrl: `${process.env.GOODREADS_URL}/oauth/authorize?oauth_token=${token.oAuthToken}&oauth_callback=${callbackUrl}`,
    });
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
