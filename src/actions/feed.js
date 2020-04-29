import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND, STORE_POS, ERROR, CLEAR, CLEAR_ERROR } from "./types";

const names = ["dog", "horse", "pig", "bird", "cat"];

export const storePos = ({ crd, rollbar }) => async dispatch => {
  try {
    dispatch({
      type: STORE_POS,
      payload: { lat: crd.latitude, long: crd.longitude }
    });
  } catch (e) {
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

export const clear = ({ sent, rollbar }) => async dispatch => {
  try {
    if (!sent) {
      dispatch({
        type: CLEAR_ERROR
      });
    }
    if (sent) {
      dispatch({
        type: CLEAR
      });
    }
  } catch (e) {
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

export const send = ({ text, rollbar }) => async dispatch => {
  try {
    const body = {
      comment: text,
      author: names[Math.floor(Math.random() * 5)],
      id: uuidv4(),
      timestamp: new Date()
    };

    await axios.post("/api/test", body);

    dispatch({
      type: SEND,
      payload: { sent: body }
    });
  } catch (e) {
    if (e.response) {
      const errors = e.response.data.errors;
      if (errors) {
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
