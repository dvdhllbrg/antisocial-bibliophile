import { get, GoodreadsAccessToken, postAuthed } from "@lib/goodreads";
import reviewReducer from "@reducers/reviewReducer";
import { NextApiHandler } from "next";
import { getCookie } from "@lib/cookies";

const Review: NextApiHandler = async (req, res) => {
  const { bookId } = req.query;
  if (bookId === "undefined" || typeof bookId === "undefined") {
    res.status(400).send("bookId not set");
    return;
  }

  const [goodreadsAccessToken, userId] = await Promise.all([
    getCookie<GoodreadsAccessToken>(req, "goodreadsAccessToken"),
    getCookie<string>(req, "userId"),
  ]);

  if (!userId || !goodreadsAccessToken) {
    res.status(401).end();
    return;
  }
  const { accessToken, accessTokenSecret } = goodreadsAccessToken;

  if (req.method === "PATCH") {
    const reqBody = JSON.parse(req.body);
    if (!reqBody.rating) {
      res.status(400).json({ msg: "No rating provided, needs to be 0-5." });
    }

    const body: any = {
      book_id: bookId,
      "review[rating]": reqBody.rating,
      shelf: "read",
    };

    try {
      const { id: reviewId } = await get("/review/show_by_user_and_book.xml", {
        book_id: bookId.toString(),
        user_id: userId,
      });

      if (reviewId) {
        await postAuthed(
          `/review/${reviewId}.xml`,
          accessToken,
          accessTokenSecret,
          {
            id: reviewId,
            ...body,
          }
        );
      } else {
        await postAuthed("/review.xml", accessToken, accessTokenSecret, body);
      }
    } catch (err) {
      res.status(500).json(err);
    }
    res.status(200).end();
  } else {
    try {
      const { review } = await get("/review/show_by_user_and_book.xml", {
        book_id: bookId.toString(),
        user_id: userId,
      });
      res.status(200).json(reviewReducer(review));
    } catch (err) {
      res
        .status(404)
        .json({ msg: `Unable to find review for book ${bookId}.` });
    }
  }
};

export default Review;

export const config = {
  api: {
    externalResolver: true,
  },
};
