import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload; //The server will return the object, so just return the payload
    default:
      return state;
  }
}
