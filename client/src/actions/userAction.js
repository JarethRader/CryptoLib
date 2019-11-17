import { USER_LOADING, GET_ACCOUNT_FAIL, GET_ACCOUNT_SUCCESS } from "./types";
import loadWeb3 from "../features/loadWeb3";
//import axios from axios;

export const getAccountAddress = account => dispatch => {
  dispatch(setUserLoading());
  if (account) {
    dispatch({
      type: GET_ACCOUNT_SUCCESS,
      payload: account
    });
  } else {
    dispatch({ type: GET_ACCOUNT_FAIL });
  }
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
