// import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND } from "./types";

const dev = process.env.NODE_ENV !== "production";

const baseUrl = dev
  ? "http://localhost:3000"
  : "http://drees1992-anone.herokuapp.com";

const names = ["dog", "horse", "pig", "bird", "cat"];

export const send = text => async dispatch => {
  const body = {
    comment: text,
    author: names[Math.floor(Math.random() * 5)],
    id: uuidv4(),
    date: new Date()
  };

  await axios.post(baseUrl + "/api/test", body);

  dispatch({
    type: SEND,
    payload: { sent: body }
  });
};
