import nextConnect from "next-connect";
import Rollbar from "rollbar";

import middleware from "../../database";

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  try {
    const { Comments } = req.models;
    const { connection } = req.connection;
    const docs = await Comments.find().sort({ date: -1 });
    res.json(docs);
    connection.close();
  } catch (e) {
    res.status(500).json({ errors: { name: e.name, message: e.message } });

    rollbar.error(e);
  }
});

handler.post(async (req, res) => {
  try {
    const { comment, author, id, date } = req.body;
    const { Comments } = req.models;
    const { connection } = req.connection;
    const entry = new Comments({
      comment,
      author,
      id,
      date
    });
    await entry.save();
    res.json(entry);
    connection.close();
  } catch (e) {
    res.status(500).json({ errors: { name: e.name, message: e.message } });

    rollbar.error(e);
  }
});

export default handler;
