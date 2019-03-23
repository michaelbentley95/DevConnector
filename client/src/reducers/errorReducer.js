import { GET_ERRORS, CLEAR_ERRORS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload; //The server will return the errors in a payload object, so just return the payload
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
