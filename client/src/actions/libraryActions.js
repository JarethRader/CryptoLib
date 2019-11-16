import { LIBRARY_LOADING, MINT_NEW_FAIL, MINT_NEW_SUCCESS } from "./types";
import axios from "axios";

export const mintNewBook = (userAddress, title, author, hash) => dispatch => {
  const body = {
    userAddress,
    title,
    author,
    hash
  };

  const config = {
    headers: {
      "Content-type": "application/json",
      "Project-Secret": "1a1819184ea44c2a8d834a3f209344d8"
    }
  };
  dispatch(setLibraryLoading());

  axios("/library/mint", body, config)
    .then(res => {
      dispatch({
        type: MINT_NEW_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: MINT_NEW_FAIL
      });
    });
};

export const setLibraryLoading = () => {
  return {
    type: LIBRARY_LOADING
  };
};
