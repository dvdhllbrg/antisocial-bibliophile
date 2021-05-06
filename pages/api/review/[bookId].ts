import withSession from '@lib/withSession';
import { get, postAuthed } from '@lib/goodreads';
import bookReducer from '@reducers/bookReducer';
import reviewReducer from '@reducers/reviewReducer';

export default withSession(async (req, res) => {
  const { bookId } = req.query;
  const { userId, accessToken, accessTokenSecret } = req.session.get('goodreads');

  if (req.method === 'PATCH') {
    const body: any = {
      book_id: id,
      'review[rating]': req.query.rating,
      shelf: 'read',
    };
    try {
      const { id: reviewId } = await get('/review/show_by_user_and_book.xml', {
        book_id: id,
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
    res.status(200).send();
  } else {
    const [bookResponse, reviewResponse] = await Promise.allSettled([
      get(`/book/show/${bookId}.xml}`),
      get('/review/show_by_user_and_book.xml', {
        book_id: bookId,
        user_id: userId,
      }),
    ]);

    if (bookResponse.status === 'rejected') {
      res.status(500).json({ msg: `Unable to find book with id ${id}.` });
      return;
    }
    const review = reviewResponse.status === 'fulfilled' ? reviewReducer(reviewResponse.value.review) : {};

    res.status(200).json({
      ...bookReducer(bookResponse.value.book),
      ...review,
    });
  }
});

export const config = {
  api: {
    externalResolver: true,
  },
};
