import withSession from '@lib/withSession';
import { get, postAuthed } from '@lib/goodreads';
import reviewReducer from '@reducers/reviewReducer';

export default withSession(async (req, res) => {
  const { bookId } = req.query;
  if (bookId === 'undefined') {
    res.status(400).send('bookId not set');
    return;
  }
  const { userId, accessToken, accessTokenSecret } = req.session.get('goodreads');
  if (!userId || !accessToken || !accessTokenSecret) {
    res.status(401).end();
    return;
  }

  if (req.method === 'PATCH') {
    const body: any = {
      book_id: bookId,
      'review[rating]': req.query.rating,
      shelf: 'read',
    };
    try {
      const { id: reviewId } = await get('/review/show_by_user_and_book.xml', {
        book_id: bookId,
        user_id: userId,
      });
      await postAuthed(`/review/${reviewId}.xml`, accessToken, accessTokenSecret, {
        id: reviewId,
        ...body,
      });
    } catch (err) {
      if (err.extensions.response.status !== 404) {
        res.status(err.extensions.response.status).json(err);
      }
      await postAuthed('/review.xml', accessToken, accessTokenSecret, body);
    }
    res.status(200).end();
  } else {
    try {
      const { review } = await get('/review/show_by_user_and_book.xml', {
        book_id: bookId,
        user_id: userId,
      });
      res.status(200).json(reviewReducer(review));
    } catch (err) {
      res.status(404).json({ msg: `Unable to find review for book ${bookId}.` });
    }
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
};
