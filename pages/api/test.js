import nextConnect from "next-connect";
import Rollbar from "rollbar";
import validator from "validator";
import { db } from "../../services/firebase";

const rollbar = new Rollbar({
  // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const handler = nextConnect();

handler.post(async (req, res) => {
  try {
    if (validator.isEmpty(req.body.comment)) {
      throw new Error("Please write something!");
    }
    if (validator.isEmpty(req.body.lat) || validator.isEmpty(req.body.long)) {
      throw new Error(
        "Location data not found, please be sure to enable location for your browser/device."
      );
    }
    const { comment, lat, long, author, id, timestamp } = req.body;
    const entry = {
      comment,
      lat,
      long,
      author,
      id,
      timestamp
    };
    await db.ref("comments").push(entry);
    res.status(200).json(entry);
  } catch (e) {
    res.status(500).json({ errors: { name: e.name, message: e.message } });
    rollbar.error(e);
  }
});

export default handler;
