import nextConnect from "next-connect";

import middleware from "../../database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const { Comments } = req.models;
  const { connection } = req.connection;
  const docs = await Comments.find().sort({ date: -1 });
  res.json(docs);
  connection.close();
});

handler.post(async (req, res) => {
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
});

export default handler;
