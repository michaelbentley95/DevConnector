import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  GET_SUCCESS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  CLEAR_SUCCESS
} from "./types";

//Register User
//The dispatch thing means that this is an async function since we have to wait for MongoDB to respond
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to localStorage
      const { token } = res.data;
      //Set token to localStorage
      localStorage.setItem("jwtToken", token);
      //Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Forgot Password - Send Reset Email
export const forgotPassword = userData => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .post("/api/users/forgotPassword", userData)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Checks the validity of the reset password token and stores it in the errors store
export const checkResetToken = token => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .get(`/api/users/resetPassword/${token}`)
    .then(res =>
      dispatch({
        type: GET_ERRORS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Reset Password - Set new password for user
export const resetPassword = (userData, token) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  axios
    .put(`/api/users/resetPassword/${token}`, userData)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  //Remove auth header for future requests
  setAuthToken(false);
  //Set current user to {} which will also set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

//Clear success
export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
