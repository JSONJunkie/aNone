import nextConnect from "next-connect";

import middleware from "../../database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const { Comments } = req.models;
  const { connection } = req.connection;
  const docs = await Comments.find();
  res.json(docs);
  connection.close();
});

handler.post(async (req, res) => {
  // const { Comments } = req.models;
  // const { connection } = req.connection;
  // const docs = await Comments.find();
  // res.json(docs);
  // connection.close();
});

export default handler;
