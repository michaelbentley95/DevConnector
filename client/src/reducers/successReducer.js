import { GET_SUCCESS, CLEAR_SUCCESS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUCCESS:
      return action.payload; //The server will return the success in a payload object, so just return the payload
    case CLEAR_SUCCESS:
      return {};
    default:
      return state;
  }
}
