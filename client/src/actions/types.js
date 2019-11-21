// Types/constants need types for actions so we can evaluate them
// Everything you do in your application you will probably have an action type for
export const USER_LOADING = "USER_LOADING";
export const USER_LOADED = "USER_LOADED";
export const GET_ADDRESS_SUCCESS = "GET_ADDRESS_SUCCESS";
export const GET_ADDRESS_FAIL = "GET_ADDRESS_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

//Library contract actions
export const LIBRARY_LOADING = "LIBRARY_LOADING";
export const LIBRARY_LOADED = "LIBRARY_LOADED";
export const UPDATE_LIBRARY = "UPDATE_LIBRARY";
export const MINT_NEW_SUCCESS = "MINT_NEW_SUCCUESS";
export const MINT_NEW_FAIL = "MINT_NEW_FAIL";
export const SHELVE_BOOK_SUCCESS = "SHELVE_BOOK_SUCCESS";
export const SHELVE_BOOK_FAIL = "SHELVE_BOOK_FAIL";
export const CLEAR_SHELF = "CLEAR_SHELF";

//error types
export const GET_ERRORS = "GET_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const AUTH_ERROR = "AUTH_ERROR";
