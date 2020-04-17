import { SEND } from "../actions/types";

const initialState = {};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SEND:
    default:
      return state;
  }
}
