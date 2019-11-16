import {
  LIBRARY_LOADING,
  MINT_NEW_FAIL,
  MINT_NEW_SUCCESS
} from "../actions/types";

const initialState = {
  libraryLoading: false,
  library: {},
  selectBook: null,
  transactionHash: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case MINT_NEW_SUCCESS:
      return {
        ...state,
        transactionHash: action.payload,
        libraryLoading: false
      };
    case MINT_NEW_FAIL:
      return {
        ...state,
        libraryLoading: false
      };
    case LIBRARY_LOADING:
      return {
        ...state,
        libraryLoading: true
      };
    default:
      return state;
  }
}
