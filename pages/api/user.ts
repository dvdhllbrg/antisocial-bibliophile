import { getCookie } from "@lib/cookies";
import { getAuthed, GoodreadsAccessToken } from "@lib/goodreads";
import userReducer from "@reducers/userReducer";
import { NextApiHandler } from "next";

const User: NextApiHandler = async (req, res) => {
  try {
    const [goodreadsAccessToken, userId] = await Promise.all([
      getCookie<GoodreadsAccessToken>(req, "goodreadsAccessToken", true),
      getCookie<string>(req, "userId"),
    ]);

    if (!goodreadsAccessToken || !userId) {
      throw new Error("Not authenticated!");
    }

    const { accessToken, accessTokenSecret } = goodreadsAccessToken;
    const user = await getAuthed(
      "/user/show.xml",
      accessToken,
      accessTokenSecret,
      { id: userId }
    );

    // res.setHeader("Cache-Control", "max-age=10, stale-while-revalidate=86400");
    res.status(200).json(userReducer(user.user));
    return;
  } catch (err) {
    res.json({
      loggedIn: false,
    });
  }
};

export default User;

export const config = {
  api: {
    externalResolver: true,
  },
};
