/* eslint-disable @typescript-eslint/naming-convention */
import withSession from '@lib/withSession';
import { getAuthed } from '@lib/goodreads';
import bookReducer from '@reducers/bookReducer';
import reviewReducer, { ReviewPropType } from '@reducers/reviewReducer';
import { Book } from '@custom-types/book';

export default withSession(async (req, res) => {
  const { userId, accessToken, accessTokenSecret } = req.session.get('goodreads');
  const {
    name, page, per_page, sort, order,
  } = req.query;

  const response = await getAuthed(`/review/list/${userId}.xml`, accessToken, accessTokenSecret, {
    v: '2',
    shelf: name ? `${name}` : '',
    page: page ? `${page}` : '1',
    per_page: per_page ? `${per_page}` : '10',
    sort: sort ? `${sort}` : 'date_updated',
    order: order ? `${order}` : 'd',
  });
  let books: Book[];
  if (response.reviews.start === '0') {
    books = [];
  } else if (Array.isArray(response.reviews.review)) {
    books = response.reviews.review.map((r: ReviewPropType) => ({
      ...bookReducer(r.book),
      ...reviewReducer(r),
    }));
  } else {
    books = [{
      ...bookReducer(response.reviews.review.book),
      ...reviewReducer(response.reviews.review),
    }];
  }

  res.status(200).json(books);
});

export const config = {
  api: {
    externalResolver: true,
  },
};
