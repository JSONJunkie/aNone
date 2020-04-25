import { SEND, CLEAR, ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
  sent: {},
  actionError: ""
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
      const { sent } = payload;
      return { ...state, sent };
    case ERROR:
      const { message } = payload;
      return { ...state, actionError: message };
    case CLEAR_ERROR:
      return { ...state, actionError: "" };
    default:
      return state;
  }
}
