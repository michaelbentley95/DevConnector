import axios from "axios";

import { GET_PARTS, PART_LOADING, CLEAR_ERRORS, GET_ERRORS } from "./types";

//Get Posts
export const getParts = () => dispatch => {
  dispatch(setPartLoading());
  axios
    .get("/api/parts")
    .then(res =>
      dispatch({
        type: GET_PARTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PARTS,
        payload: null
      })
    );
};

//Create Part
export const createPart = (partData, history) => dispatch => {
  axios
    .post("/api/parts", partData)
    .then(res => history.push("/parts"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set loading state
export const setPartLoading = () => {
  return {
    type: PART_LOADING
  };
};

//Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
