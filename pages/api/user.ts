import { getCookie, setCookie } from "@lib/cookies";
import { getAuthed, GoodreadsAccessToken } from "@lib/goodreads";
import userReducer from "@reducers/userReducer";
import { NextApiHandler } from "next";

const User: NextApiHandler = async (req, res) => {
  try {
    const [goodreadsAccessToken, userId] = await Promise.all([
      getCookie<GoodreadsAccessToken>(req, "goodreadsAccessToken"),
      getCookie<string>(req, "userId"),
    ]);

    if (!goodreadsAccessToken) {
      throw new Error("Not authenticated!");
    }

    const { accessToken, accessTokenSecret } = goodreadsAccessToken;
    let newUserId;
    if (!userId) {
      const user = await getAuthed(
        "/api/auth_user",
        accessToken,
        accessTokenSecret
      );
      newUserId = user.user.id;
      await setCookie(res, "userId", newUserId);
    }
    const user = await getAuthed(
      "/user/show.xml",
      accessToken,
      accessTokenSecret,
      { id: userId ?? newUserId }
    );
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
