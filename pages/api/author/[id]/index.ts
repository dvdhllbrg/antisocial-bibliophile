import type { NextApiRequest, NextApiResponse } from "next";
import { get } from "@lib/goodreads";
import authorReducer from "@reducers/authorReducer";

const Author = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (id === "undefined" || typeof id === "undefined") {
    res.status(400).send("id not set");
    return;
  }
  try {
    const { author } = await get(`/author/show/${id}`);
    res.status(200).json(authorReducer(author));
  } catch (err) {
    console.error(err);
    res.status(500).json(`Unable to find author with id ${id}.`);
  }
};
export default Author;

export const config = {
  api: {
    externalResolver: true,
  },
};
