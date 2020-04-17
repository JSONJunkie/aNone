// import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND } from "./types";

const dev = process.env.NODE_ENV !== "production";

const baseUrl = dev
  ? "http://localhost:3000"
  : "http://drees1992-anone.herokuapp.com";

export const send = text => async dispatch => {
  const body = {
    comment: text,
    author: uuidv4()
  };
  const res = await axios.post(baseUrl + "/api/test", body);

  dispatch({
    type: SEND
  });
};
