import type { NextApiRequest, NextApiResponse } from 'next';
import { get } from '@lib/goodreads';
import authorReducer from '@reducers/authorReducer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { author } = await get(`/author/show/${id}`);
  res.status(200).json(authorReducer(author));
};

export const config = {
  api: {
    externalResolver: true,
  },
};
