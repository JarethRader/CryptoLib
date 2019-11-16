import {
  USER_LOADING,
  GET_ACCOUNT_SUCCESS,
  GET_ACCOUNT_FAIL
} from "../actions/types";

const initialState = {
  userAccount: null,
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ACCOUNT_SUCCESS:
      return {
        ...state,
        userAccount: action.payload,
        isLoading: false
      };
    case GET_ACCOUNT_FAIL:
      return {
        ...state,
        userAccount: null,
        isLoading: false
      };
    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      };
    default:
      return state;
  }
}
