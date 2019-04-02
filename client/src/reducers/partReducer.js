import { GET_PARTS, PART_LOADING } from "../actions/types";

const initialState = {
  parts: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PART_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_PARTS:
      return {
        ...state,
        parts: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
