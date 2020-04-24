// import useSWR from "swr";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND, ERROR, CLEAR_ERROR } from "./types";
import Rollbar from "rollbar";

const dev = process.env.NODE_ENV !== "production";

const baseUrl = dev
  ? "http://localhost:3000"
  : "https://drees1992-anone.herokuapp.com";

const names = ["dog", "horse", "pig", "bird", "cat"];

export const clearError = () => async dispatch => {
  try {
    dispatch({
      type: SEND,
      payload: { sent: body }
    });
  } catch (e) {
    Rollbar.error(e);
    dispatch({
      type: ERROR,
      payload: {
        name: e.name,
        message: e.message
      }
    });
  }
};

export const send = text => async dispatch => {
  try {
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
  } catch (e) {
    Rollbar.error(e);
    dispatch({
      type: ERROR,
      payload: {
        name: e.name,
        message: e.message
      }
    });
  }
};
