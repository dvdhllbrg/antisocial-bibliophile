import { getAuthed, GoodreadsAccessToken, postAuthed } from "@lib/goodreads";
import bookReducer from "@reducers/bookReducer";
import reviewReducer, { ReviewPropType } from "@reducers/reviewReducer";
import { Book } from "@custom-types/book";
import { getCookie } from "@lib/cookies";
import { NextApiHandler } from "next";

const Shelf: NextApiHandler = async (req, res) => {
  const [goodreadsAccessToken, userId] = await Promise.all([
    getCookie<GoodreadsAccessToken>(req, "goodreadsAccessToken", true),
    getCookie<string>(req, "userId"),
  ]);

  if (!userId || !goodreadsAccessToken) {
    res.status(401).end();
    return;
  }

  const { accessToken, accessTokenSecret } = goodreadsAccessToken;

  if (req.method === "POST") {
    const { name, main } = req.query;
    const body = {
      "user_shelf[name]": name,
      "user_shelf[exclusive_flag]": main,
    };
    await postAuthed("/user_shelves.xml", accessToken, accessTokenSecret, body);
    res.status(200).end();
  } else if (req.method === "PATCH") {
    const { name, book_id, remove } = req.query;
    if (remove) {
      if (name === "read" || name === "currently-reading") {
        await postAuthed(
          "/shelf/add_to_shelf.xml",
          accessToken,
          accessTokenSecret,
          {
            name: "to-read",
            book_id,
          }
        );
        await postAuthed(
          "/shelf/add_to_shelf.xml",
          accessToken,
          accessTokenSecret,
          {
            name: "to-read",
            book_id,
            a: "remove",
          }
        );
      } else {
        await postAuthed(
          "/shelf/add_to_shelf.xml",
          accessToken,
          accessTokenSecret,
          {
            name,
            book_id,
            a: "remove",
          }
        );
      }
    } else {
      await postAuthed(
        "/shelf/add_to_shelf.xml",
        accessToken,
        accessTokenSecret,
        {
          name,
          book_id,
        }
      );
    }
    res.status(200).end();
  } else {
    const { name, page, per_page, sort, order } = req.query;

    const response = await getAuthed(
      `/review/list/${userId}.xml`,
      accessToken,
      accessTokenSecret,
      {
        v: "2",
        shelf: name ? `${name}` : "",
        page: page ? `${page}` : "1",
        per_page: per_page ? `${per_page}` : "10",
        sort: sort ? `${sort}` : "date_updated",
        order: order ? `${order}` : "d",
      }
    );
    let books: Book[];
    if (response.reviews.start === "0") {
      books = [];
    } else if (Array.isArray(response.reviews.review)) {
      books = response.reviews.review.map((r: ReviewPropType) => ({
        ...bookReducer(r.book),
        ...reviewReducer(r),
      }));
    } else {
      books = [
        {
          ...bookReducer(response.reviews.review.book),
          ...reviewReducer(response.reviews.review),
        },
      ];
    }
    // res.setHeader("Cache-Control", "max-age=10, stale-while-revalidate=86400");
    res.status(200).json(books);
  }
};

export default Shelf;

export const config = {
  api: {
    externalResolver: true,
  },
};
