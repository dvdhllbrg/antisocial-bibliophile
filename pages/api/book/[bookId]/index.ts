import withSession from "@lib/withSession";
import { get } from "@lib/goodreads";
import bookReducer from "@reducers/bookReducer";

export default withSession(async (req, res) => {
  const { bookId } = req.query;
  if (bookId === "undefined") {
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
});

export const config = {
  api: {
    externalResolver: true,
  },
};
