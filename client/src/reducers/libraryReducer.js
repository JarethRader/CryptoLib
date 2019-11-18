import {
  LIBRARY_LOADING,
  LIBRARY_LOADED,
  UPDATE_LIBRARY,
  MINT_NEW_FAIL,
  MINT_NEW_SUCCESS,
  SHELVE_BOOK_FAIL,
  SHELVE_BOOK_SUCCESS
} from "../actions/types";

const initialState = {
  libraryLoading: false,
  loadingDone: false,
  library: [],
  transactionHash: null,
  book: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LIBRARY_LOADED:
      return {
        ...state,
        loadingDone: true
      };
    case UPDATE_LIBRARY:
      return {
        ...state,
        libraryLoaded: false
      };
    case SHELVE_BOOK_SUCCESS:
      return {
        ...state,
        book: action.payload,
        library: [action.payload, ...state.library]
      };
    case MINT_NEW_SUCCESS:
      return {
        ...state,
        transactionHash: action.payload,
        libraryLoading: false
      };
    case SHELVE_BOOK_FAIL:
      return {
        ...state,
        book: {},
        libraryLoading: false
      };
    case MINT_NEW_FAIL:
      return {
        ...state,
        transactionHash: null,
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
