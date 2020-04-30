import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { SEND, STORE_POS, ERROR, GEO_FAIL, CLEAR_ERROR } from "./types";

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

export const geoFail = ({ rollbar }) => async dispatch => {
  try {
    dispatch({
      type: GEO_FAIL
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

export const clear = ({ rollbar }) => async dispatch => {
  try {
    dispatch({
      type: CLEAR_ERROR
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

export const send = ({ text, lat, long, rollbar }) => async dispatch => {
  try {
    const body = {
      comment: text,
      lat,
      long,
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
