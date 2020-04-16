import nextConnect from "next-connect";

import middleware from "../../middleware/database";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  let docs = await req.db.collection("comments").find().toArray();
  //   console.log(docs);
  res.json(docs);
});

export default handler;
