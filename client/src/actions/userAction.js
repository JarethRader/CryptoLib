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
  AUTH_ERROR,
} from "./types";
import { tokenConfig } from "./actionUtils/tokenConfig";
import { returnErrors } from "./errorActions";
import axios from "axios";
import config from "./actionUtils/userConfig";

export const getMetamaskAddress = (account) => (dispatch) => {
  dispatch(setUserLoading());
  if (account) {
    dispatch({
      type: GET_ADDRESS_SUCCESS,
      payload: account,
    });
  } else {
    dispatch(
      returnErrors(
        "Unable to get your Metamask account address. Are you logged in?",
        400
      )
    );
    dispatch({ type: GET_ADDRESS_FAIL });
  }
};

export const loadUser = () => (dispatch, getState) => {
  //user loading
  dispatch(setUserLoading());
  tokenConfig(getState, config)
    .then((reqHeaders) => {
      axios
        .get("/user/auth", {
          headers: reqHeaders.headers,
        })
        .then((res) => {
          dispatch({
            type: USER_LOADED,
            payload: res.data,
          });
        })
        .catch((err) => {
          dispatch({
            type: AUTH_ERROR,
          });
        });
    })
    .catch((err) => {
      dispatch(returnErrors("Unauthorized user", 401));
      dispatch({ type: AUTH_ERROR });
    });
};

export const register = ({ username, password, email, address }) => (
  dispatch
) => {
  try {
    if (!email || !password) {
      throw new Error("Please enter all fields");
    }
    if (!address) {
      throw new Error("No web3 provider detected");
    }
    if (!username) {
      username = "";
    }

    // Request body
    const body = {
      username,
      email,
      password,
      address,
    };

    axios
      .post("/user/signup", body, config)
      .then((res) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    if (err) {
      if (err.response.data) {
        dispatch(returnErrors(err.response.data.message, err.response.status));
      } else if (err.repsone.message) {
        dispatch(returnErrors(err.response.message, err.response.status));
      } else {
        dispatch(returnErrors("Something happened", err.response.status));
      }
    }
    dispatch({ type: REGISTER_FAIL });
  }
};

export const login = ({ password, address }) => (dispatch) => {
  if (!password) {
    throw Error("Please enter password");
  } else if (!address) {
    throw Error("Now address detected. Please connect MetaMask");
  }

  const body = {
    password: password,
    address: address,
  };

  dispatch(setUserLoading());

  axios
    .post("/user/login", body, config)
    .then((res) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err) {
        if (err.response.data) {
          dispatch(
            returnErrors(err.response.data.message, err.response.status)
          );
        } else if (err.repsone.message) {
          dispatch(returnErrors(err.response.message, err.response.status));
        } else {
          dispatch(returnErrors("Something happened", err.response.status));
        }
      }
      dispatch({ type: LOGIN_FAIL });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
