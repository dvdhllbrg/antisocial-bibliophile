import { get } from "@lib/goodreads";
import bookReducer from "@reducers/bookReducer";
import { NextApiHandler } from "next";

const Book: NextApiHandler = async (req, res) => {
  const { bookId } = req.query;
  if (bookId === "undefined" || typeof bookId === "undefined") {
    res.status(400).send("bookId not set");
    return;
  }

  try {
    const { book } = await get(`/book/show/${bookId}.xml}`);
    res.status(200).json(bookReducer(book));
  } catch (err) {
    // console.error(err);
    res.status(404).json(`Unable to find book with id ${bookId}.`);
  }
};

export default Book;

export const config = {
  api: {
    externalResolver: true,
  },
};
