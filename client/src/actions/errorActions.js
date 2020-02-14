import { GET_ERRORS, CLEAR_ERRORS, SHOW_ERROR, HIDE_ERROR } from "./types";

// return errors
export const returnErrors = (msg, status, id = null) => {
  return {
    type: GET_ERRORS,
    payload: {
      msg,
      status,
      id
    }
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const showErrorModal = () => {
  return {
    type: SHOW_ERROR
  };
};

export const hideErrorModal = () => {
  return {
    type: HIDE_ERROR
  };
};
