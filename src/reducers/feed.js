import { SEND, STORE_POS, CLEAR, ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
  sent: {},
  actionError: "",
  lat: "",
  long: "",
  location: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
      const { sent } = payload;
      return { ...state, sent };
    case STORE_POS:
      const { lat, long } = payload;
      return { ...state, lat, long, location: true };
    case ERROR:
      const { message } = payload;
      return { ...state, actionError: message };
    case CLEAR:
      return {
        ...state,
        actionError: "",
        lat: "",
        long: "",
        location: false
      };
    case CLEAR_ERROR:
      return { ...state, actionError: "" };
    default:
      return state;
  }
}
