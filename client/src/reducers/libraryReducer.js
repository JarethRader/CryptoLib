import {
  LIBRARY_LOADING,
  CHECKOUT_LOADING,
  RETURN_LOADING,
  LIBRARY_LOADED,
  UPDATE_LIBRARY,
  MINT_NEW_FAIL,
  MINT_NEW_SUCCESS,
  SHELVE_BOOK_FAIL,
  SHELVE_BOOK_SUCCESS,
  CLEAR_SHELF,
  CHECKOUT_FAIL,
  CHECKOUT_SUCCESS,
  GET_OWN_SUCCESS,
  GET_OWN_FAIL,
  RETURN_SUCCESS,
  RETURN_FAIL
} from "../actions/types";

const initialState = {
  libraryLoading: false,
  checkingOut: {
    checkoutLoading: false,
    bookID: null
  },
  returning: {
    returnLoading: false,
    bookID: null
  },
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
    case RETURN_SUCCESS:
      return {
        ...state,
        ownShelf: state.ownShelf.filter(bookID => bookID !== action.returned),
        transactionHash: action.payload,
        returning: {
          returnLoading: false,
          bookID: null
        }
      };
    case MINT_NEW_SUCCESS:
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        transactionHash: action.payload,
        checkingOut: {
          checkoutLoading: false,
          bookID: null
        }
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
    case CHECKOUT_FAIL:
      return {
        ...state,
        transactionHash: null,
        checkingOut: {
          checkoutLoading: false,
          bookID: null
        }
      };
    case RETURN_FAIL:
      return {
        ...state,
        transactionHash: null,
        returning: {
          returnLoading: false,
          bookID: null
        }
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
    case CHECKOUT_LOADING:
      return {
        ...state,
        checkingOut: {
          checkoutLoading: true,
          bookID: action.bookID
        }
      };
    case RETURN_LOADING:
      return {
        ...state,
        returning: {
          returnLoading: true,
          bookID: action.bookID
        }
      };
    default:
      return state;
  }
}
