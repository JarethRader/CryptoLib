import {
  LIBRARY_LOADING,
  LIBRARY_LOADED,
  UPDATE_LIBRARY,
  MINT_NEW_FAIL,
  MINT_NEW_SUCCESS,
  SHELVE_BOOK_SUCCESS,
  SHELVE_BOOK_FAIL,
  CLEAR_SHELF,
  CHECKOUT_FAIL,
  CHECKOUT_SUCCESS,
  GET_OWN_SUCCESS,
  GET_OWN_FAIL,
  RETURN_SUCCESS,
  RETURN_FAIL
} from "./types";
import axios from "axios";

const config = {
  headers: {
    "Content-type": "application/json",
    "Project-Secret": "1a1819184ea44c2a8d834a3f209344d8"
  }
};

export const mintNewBook = (userAddress, title, author, hash) => dispatch => {
  const body = {
    userAddress,
    title,
    author,
    hash
  };

  dispatch(setLibraryLoading());

  axios
    .post("/library/mint", body, config)
    .then(res => {
      dispatch({
        type: MINT_NEW_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      // console.log(err);
      dispatch({
        type: MINT_NEW_FAIL
      });
    });
};

export const shelveBook = book => dispatch => {
  dispatch(setLibraryLoading());
  if (book) {
    dispatch({
      type: SHELVE_BOOK_SUCCESS,
      payload: book
    });
  } else {
    dispatch({ type: SHELVE_BOOK_FAIL });
  }
};

export const libraryLoaded = () => {
  return {
    type: LIBRARY_LOADED
  };
};

export const clearShelf = () => {
  return {
    type: CLEAR_SHELF
  };
};

export const checkout = (bookID, userAddress) => dispatch => {
  dispatch(setLibraryLoading());

  const body = {
    bookID,
    userAddress
  };

  axios
    .post("library/checkout", body, config)
    .then(res => {
      dispatch({
        type: CHECKOUT_SUCCESS,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({ type: CHECKOUT_FAIL });
    });
};

export const returnBook = bookID => dispatch => {
  dispatch(setLibraryLoading());

  const body = {
    bookID
  };

  axios
    .post("/library/return", body)
    .then(res => {
      dispatch({
        type: RETURN_SUCCESS,
        payload: res.data,
        returned: bookID
      });
    })
    .catch(err => {
      console.log(err);
      dispatch({
        type: RETURN_FAIL
      });
    });
};

export const getOwn = address => dispatch => {
  dispatch(setLibraryLoading());

  const body = {
    address
  };

  axios
    .post("/library/getOwn", body)
    .then(res => {
      let books = res.data.booksOfOwner;
      dispatch({
        type: GET_OWN_SUCCESS,
        payload: books
      });
    })
    .catch(err => {
      // console.log(err);
      dispatch({
        type: GET_OWN_FAIL
      });
    });
};

export const setLibraryLoading = () => {
  return {
    type: LIBRARY_LOADING
  };
};
