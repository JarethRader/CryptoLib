import { USER_LOADING, GET_ACCOUNT_FAIL, GET_ACCOUNT_SUCCESS } from "./types";
import loadWeb3 from "../features/loadWeb3";
//import axios from axios;

export const getAccountAddress = () => dispatch => {
  dispatch(setUserLoading());
  return loadWeb3()
    .then(web3 => {
      console.log(web3);
      let accounts = web3.eth.getAccounts();
      console.log(accounts);
      dispatch({
        type: GET_ACCOUNT_SUCCESS,
        payload: accounts[0]
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: GET_ACCOUNT_FAIL });
    });
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
