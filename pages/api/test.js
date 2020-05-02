import nextConnect from "next-connect";
import Rollbar from "rollbar";
import validator from "validator";
import axios from "axios";

import { db } from "../../services/firebase";

const rollbar = new Rollbar({
  // accessToken: process.env.ROLLBAR_SERVER_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true
});

const handler = nextConnect();

handler.get(async (req, res) => {
  try {
    if (
      validator.isEmpty(req.query.latitude) ||
      validator.isEmpty(req.query.longitude)
    ) {
      throw new Error("There was a problem getting your location data.");
    }

    const { latitude, longitude } = req.query;

    const url =
      "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      longitude +
      "," +
      latitude +
      ".json?access_token=" +
      process.env.MAPBOX_KEY;

    const axiosRes = await axios.get(url);

    const userCity = axiosRes.data.features[0].context[2].text;
    const userState = axiosRes.data.features[0].context[3].text;

    res.status(200).json({ userCity, userState });
  } catch (e) {
    res.status(500).json({ errors: { name: e.name, message: e.message } });
    rollbar.error(e);
  }
});

handler.post(async (req, res) => {
  try {
    if (validator.isEmpty(req.body.comment)) {
      throw new Error("Please write something!");
    }
    if (
      validator.isEmpty(req.body.userCity) ||
      validator.isEmpty(req.body.userState)
    ) {
      throw new Error(
        "Location data not found, please be sure to enable location for your browser/device."
      );
    }

    const { comment, userCity, userState, author, id, timestamp } = req.body;
    const entry = {
      comment,
      userCity,
      userState,
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
