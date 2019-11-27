import {
  LIBRARY_LOADING,
  LIBRARY_LOADED,
  UPDATE_LIBRARY,
  MINT_NEW_FAIL,
  MINT_NEW_SUCCESS,
  SHELVE_BOOK_FAIL,
  SHELVE_BOOK_SUCCESS,
  CLEAR_SHELF,
  CHECKOUT_FAIL,
  CHECKOUT_SUCCESS,
  RETURN_FAIL,
  GET_OWN_SUCCESS,
  GET_OWN_FAIL
} from "../actions/types";

const initialState = {
  libraryLoading: false,
  loadingDone: false,
  library: [],
  transactionHash: null,
  shelvingBook: {},
  ownShelf: []
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
    case GET_OWN_SUCCESS:
      return {
        ...state,
        ownShelf: action.payload,
        libraryLoading: false
      };
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        transactionHash: action.payload,
        libraryLoading: false
      };
    case CLEAR_SHELF:
      return {
        ...state,
        library: [],
        shelvingBook: {}
      };
    case SHELVE_BOOK_SUCCESS:
      return {
        ...state,
        shelvingBook: action.payload,
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
        shelvingBook: {},
        libraryLoading: false
      };
    case GET_OWN_FAIL:
      return {
        ...state,
        ownShelf: [],
        transactionHash: null,
        libraryLoading: false
      };
    case RETURN_FAIL:
    case CHECKOUT_FAIL:
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
