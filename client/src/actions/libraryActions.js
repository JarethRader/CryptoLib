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
    tokenConfig(getState, config)
      .then(reqHeaders => {
        if (reqHeaders) {
          axios({
            url: "/library/checkout",
            method: "post",
            data: body,
            headers: reqHeaders.headers
          })
            .then(res => {
              dispatch({
                type: CHECKOUT_SUCCESS,
                payload: res.data,
                bookCheckedOut: bookID
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
          throw new Error({ message: "Not logged in" });
        }
      })
      .catch(err => {
        throw new Error({ message: "Unauthorized user", status: 401 });
      });
  } catch (err) {
    dispatch(
      returnErrors(
        err.response.data ? err.response.data.message : err.response.message,
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

  axios({
    url: "/library/return",
    method: "post",
    data: body
  })
    .then(res => {
      dispatch({
        type: RETURN_SUCCESS,
        payload: res.data,
        bookReturned: bookID
      });
    })
    .catch(err => {
      dispatch(
        returnErrors(
          err.response.data ? err.response.data.message : err.response.message,
          err.response.status ? err.response.status : 400
        )
      );
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

  axios({
    url: "/library/getOwn",
    method: "post",
    data: body
  })
    .then(res => {
      let books = res.data.booksOfOwner;
      dispatch({
        type: GET_OWN_SUCCESS,
        payload: books
      });
    })
    .catch(err => {
      if (err.response.data) {
        dispatch(returnErrors(err.response.data.message, err.response.status));
      } else {
        dispatch(returnErrors(err.response.message, err.response.status));
      }
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
