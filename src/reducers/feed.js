import { SEND, ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
  sent: {},
  error: ""
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
      const { sent } = payload;
      return { ...state, sent };
    case ERROR:
      const { message } = payload;
      return { ...state, error: message };
    case CLEAR_ERROR:
      return { ...state, error: "" };
    default:
      return state;
  }
}
