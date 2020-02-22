import {
  LIBRARY_LOADING,
  CHECKOUT_LOADING,
  RETURN_LOADING,
  LIBRARY_LOADED,
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
import { tokenConfig } from "./actionUtils/tokenConfig";
import { returnErrors } from "./errorActions";
import config from "./actionUtils/libraryConfig";

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
      dispatch(returnErrors(err.response.data.msg, err.response.status));
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

export const checkout = (bookID, userAddress) => (dispatch, getState) => {
  dispatch(setCheckoutLoading(bookID));

  const body = {
    bookID,
    userAddress
  };
  try {
    if (getState().user.token !== null) {
      axios
        .post("library/checkout", body, tokenConfig(getState, config))
        .then(res => {
          dispatch({
            type: CHECKOUT_SUCCESS,
            payload: res.data
          });
        })
        .catch(err => {
          if (err.response) {
            throw err.response.data;
          } else {
            throw err.request.data;
          }
        });
    } else {
      throw new Error("Not logged in");
    }
  } catch (err) {
    dispatch(
      returnErrors(
        err.message ? err.message : err.msg,
        err.status ? err.status : 400
      )
    );
    dispatch({
      type: CHECKOUT_FAIL
    });
  }
};

export const returnBook = bookID => dispatch => {
  dispatch(setReturnLoading(bookID));

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
      dispatch(returnErrors(err.response.data.msg, err.response.status));
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
      dispatch(returnErrors(err.response.data.msg, err.response.status));
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

export const setCheckoutLoading = bookID => {
  return {
    type: CHECKOUT_LOADING,
    bookID: bookID
  };
};

export const setReturnLoading = bookID => {
  return {
    type: RETURN_LOADING,
    bookID: bookID
  };
};
