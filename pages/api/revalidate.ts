import { NextApiHandler } from "next";

const Revalidate: NextApiHandler = async (req, res) => {
  try {
    const { path } = req.body;
    if (!path) {
      throw new Error();
    }
    await res.revalidate(path.toString());
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send("Error revalidating");
  }
};

export default Revalidate;
