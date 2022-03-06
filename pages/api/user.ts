import withSession from "@lib/withSession";
import { getAuthed } from "@lib/goodreads";
import userReducer from "@reducers/userReducer";

export default withSession(async (req, res) => {
  try {
    const { goodreadsAccessToken, userId } = req.session;
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
      req.session.userId = newUserId;
      await req.session.save();
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
});

export const config = {
  api: {
    externalResolver: true,
  },
};
