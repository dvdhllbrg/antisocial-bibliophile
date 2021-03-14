import { withIronSession } from 'next-iron-session';
import { get, getAuthed } from '../../lib/goodreads';
import { userReducer } from '../../reducers';

async function handler(req, res) {
  const gr = req.session.get('goodreads');
  const me = await getAuthed('/api/auth_user', gr.accessToken, gr.accessTokenSecret);
  const user = await get('/user/show.xml', { id: me.user.id });
  req.session.set('goodreads', {
    ...gr,
    userId: me.user.id,
  });
  await req.session.save();
  res.status(200).json(userReducer(user.user));
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
