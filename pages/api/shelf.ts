import { withIronSession } from 'next-iron-session';
import { getAuthed } from '../../lib/goodreads';
import { bookReducer, reviewReducer } from '../../reducers';
import { ReviewPropType } from '../../reducers/reviewReducer';
import { Book } from '../../types/book';

async function handler(req, res) {
  const { userId, accessToken, accessTokenSecret } = req.session.get('goodreads');
  const params = new URLSearchParams(req.query);

  const response = await getAuthed(`/review/list/${userId}.xml?v=2&${params.toString()}`, accessToken, accessTokenSecret);
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
  const hasMore = response.reviews.end !== response.reviews.total && response.reviews.start !== '0';

  res.status(200).json({
    page: req.query.page || 1,
    hasMore,
    books,
  });
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
