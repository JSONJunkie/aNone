import { SEND } from "../actions/types";

const initialState = {
  sent: {}
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
      const { sent } = payload;
      return { ...state, sent };
    default:
      return state;
  }
}
