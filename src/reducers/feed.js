import {
  SEND,
  STORE_POS,
  GEO_FAIL,
  ERROR,
  CLEAR_ERROR
} from "../actions/types";

const initialState = {
  sent: {},
  actionError: "",
  lat: "",
  long: "",
  userCity: "",
  userState: "",
  location: false,
  geoFailStatus: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
      const { sent } = payload;
      return { ...state, sent };
    case STORE_POS:
      const { lat, long, userCity, userState } = payload;
      return {
        ...state,
        lat,
        long,
        userCity,
        userState,
        location: true,
        geoFailStatus: false
      };
    case ERROR:
      const { message } = payload;
      return { ...state, actionError: message };
    case GEO_FAIL:
      return {
        ...state,
        actionError: "",
        lat: "",
        long: "",
        location: false,
        geoFailStatus: true
      };
    case CLEAR_ERROR:
      return { ...state, actionError: "" };
    default:
      return state;
  }
}
