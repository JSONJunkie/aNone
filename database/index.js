// import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import nextConnect from "next-connect";

import CommentsSchema from "../database/models/Comments";

// const client = new MongoClient(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// async function database(req, res, next) {
//   if (!client.isConnected()) await client.connect();
//   req.dbClient = client;
//   req.db = client.db("aNone");
//   return next();
// }

const connectToMongo = async () => {
  const connection = await mongoose.createConnection(process.env.MONGO_URI, {
    useNewUrlParser: true,
    bufferCommands: false,
    bufferMaxEntries: 0,
    useUnifiedTopology: true
  });

  const Comments = connection.model("comments", CommentsSchema);
  return {
    connection,
    models: {
      Comments
    }
  };
};

async function database(req, res, next) {
  const { connection, models } = await connectToMongo();
  req.connection = connection;
  req.models = models;
  return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
