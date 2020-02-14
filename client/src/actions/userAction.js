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
import config from "./actionUtils/userConfig";

export const getMetamaskAddress = account => dispatch => {
  dispatch(setUserLoading());
  if (account) {
    dispatch({
      type: GET_ADDRESS_SUCCESS,
      payload: account
    });
  } else {
    dispatch(
      returnErrors(
        "Unable to get you Metamask account address. Are you logged in?",
        400
      )
    );
    dispatch({ type: GET_ADDRESS_FAIL });
  }
};

export const loadUser = () => (dispatch, getState) => {
  //user loading
  dispatch(setUserLoading());
  if (getState().user.token !== null) {
    axios
      .get("/user/auth", tokenConfig(getState, config))
      .then(res => {
        dispatch({
          type: USER_LOADED,
          payload: res.data
        });
      })
      .catch(err => {
        console.log(err.data);
        dispatch(returnErrors(err.response.msg, err.response.status));
        dispatch({
          type: AUTH_ERROR
        });
      });
  } else {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register = ({
  username,
  password,
  email,
  address
}) => dispatch => {
  if (!email || !password) {
    throw Error("Please enter all fields");
  }
  if (!address) {
    throw Error("No web3 provider detected");
  }
  if (!username) {
    username = "";
  }

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
      dispatch(returnErrors(err.response.msg, err.response.status));
      dispatch({ type: REGISTER_FAIL });
    });
};

export const login = ({ password, address }) => dispatch => {
  if (!password) {
    throw Error("Please enter password");
  } else if (!address) {
    throw Error("Now address detected. Please connect MetaMask");
  }

  const body = JSON.stringify({ password, address });

  dispatch(setUserLoading());

  axios
    .post("/user/login", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.msg, err.response.status));
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
