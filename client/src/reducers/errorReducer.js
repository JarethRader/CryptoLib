import {
  GET_ERRORS,
  CLEAR_ERRORS,
  SHOW_ERROR,
  HIDE_ERROR
} from "../actions/types";

const initialState = {
  msg: {},
  status: null,
  id: null,
  showErrorModal: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      if (action.payload.status >= 400 && action.payload.status < 500) {
        return {
          msg: action.payload.msg,
          status: action.payload.status,
          id: action.payload.id,
          showErrorModal: true
        };
      } else {
        return {
          msg: action.payload.msg,
          status: action.payload.status,
          id: action.payload.id
        };
      }
    case CLEAR_ERRORS:
      return {
        msg: {},
        status: null,
        id: null
      };
    case SHOW_ERROR:
      return {
        showErrorModal: true
      };
    case HIDE_ERROR:
      return {
        showErrorMoral: false
      };
    default:
      return state;
  }
}
