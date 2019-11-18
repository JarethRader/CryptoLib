import {
  USER_LOADING,
  USER_LOADED,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR
} from "./types";
import { tokenConfig } from "./actionUtils/tokenConfig";
import { returnErrors } from "./errorActions";
import axios from "axios";

export const getMetamaskAddress = account => dispatch => {
  dispatch(setUserLoading());
  if (account) {
    dispatch({
      type: GET_ADDRESS_SUCCESS,
      payload: account
    });
  } else {
    dispatch({ type: GET_ADDRESS_FAIL });
  }
};

export const loadUser = () => (dispatch, getState) => {
  dispatch(setUserLoading());

  axios
    .get("/user", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.msg, err.status));
      dispatch({ type: AUTH_ERROR });
    });
};

export const register = ({
  username,
  password,
  email,
  address
}) => dispatch => {
  //Headers
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ username, email, password, address });

  axios
    .post("/user/signup", body, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.msg, err.status));
      dispatch({ type: REGISTER_FAIL });
    });
};

export const login = ({ username, password, address }) => dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ username, password, address });

  dispatch(setUserLoading());

  axios
    .post("/user/auth", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.msg, err.status));
      dispatch({ type: LOGIN_FAIL });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
