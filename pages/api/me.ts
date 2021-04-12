import withSession from '@lib/withSession';
import { get, getAuthed } from '@lib/goodreads';
import userReducer from '@reducers/userReducer';

export default withSession(async (req, res) => {
  const gr = req.session.get('goodreads');
  let { userId } = gr;
  if (!gr.userId) {
    const me = await getAuthed('/api/auth_user', gr.accessToken, gr.accessTokenSecret);
    userId = me.user.id;
    req.session.set('goodreads', {
      ...gr,
      userId,
    });
    await req.session.save();
  }
  const user = await get('/user/show.xml', { id: userId });
  res.status(200).json(userReducer(user.user));
});

export const config = {
  api: {
    externalResolver: true,
  },
};
