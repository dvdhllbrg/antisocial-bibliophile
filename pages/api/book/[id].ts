import withSession from '@lib/withSession';
import { get } from '@lib/goodreads';
import bookReducer from '@reducers/bookReducer';
import reviewReducer from '@reducers/reviewReducer';

export default withSession(async (req, res) => {
  const { id } = req.query;
  const { userId } = req.session.get('goodreads');

  const [bookResponse, reviewResponse] = await Promise.allSettled([
    get(`/book/show/${id}.xml}`),
    get('/review/show_by_user_and_book.xml', {
      book_id: id,
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
});

export const config = {
  api: {
    externalResolver: true,
  },
};
