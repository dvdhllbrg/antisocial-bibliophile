import type { NextApiRequest, NextApiResponse } from 'next';
import { get } from '@lib/goodreads';
import searchResultReducer from '@reducers/searchResultReducer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query, page = '1', limit = '10' } = req.query;
  const { search } = await get('/search/index.xml', {
    q: query as string,
    limit: limit as string,
    page: page as string,
  });
  if (search['results-end'] === '0' || search['total-results'] === '0') {
    res.status(200).json([]);
    return;
  }
  res.status(200).json(
    Array.isArray(search.results.work)
      ? search.results.work.slice(0, limit).map(searchResultReducer, this)
      : [searchResultReducer(search.results.work)],
  );
};

export const config = {
  api: {
    externalResolver: true,
  },
};
