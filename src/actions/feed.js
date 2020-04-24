import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND, ERROR, CLEAR_ERROR } from "./types";

const dev = process.env.NODE_ENV !== "production";

const baseUrl = dev
  ? "http://localhost:3000"
  : "https://drees1992-anone.herokuapp.com";

const names = ["dog", "horse", "pig", "bird", "cat"];

export const clear = ({ rollbar }) => async dispatch => {
  try {
    dispatch({
      type: SEND,
      payload: { sent: body }
    });
  } catch (e) {
    rollbar.error(e);
    dispatch({
      type: CLEAR_ERROR,
      payload: {
        name: e.name,
        message: e.message
      }
    });
  }
};

export const send = ({ text, rollbar }) => async dispatch => {
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
    if (e.response) {
      const errors = e.response.data.errors;
      if (errors) {
        rollbar.error(errors.message);
        return dispatch({
          type: ERROR,
          payload: {
            name: errors.namrrors,
            message: errors.message
          }
        });
      }
    }
    rollbar.error(e);
    dispatch({
      type: ERROR,
      payload: {
        name: e.name,
        message: e.message
      }
    });
  }
};
