import {
  USER_LOADING,
  USER_LOADED,
  GET_ADDRESS_SUCCESS,
  GET_ADDRESS_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_ERROR,
  LOGOUT_SUCCESS
} from "../actions/types";

const initialState = {
  userAddress: null,
  user: {},
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case USER_LOADED:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false
      };
    case LOGOUT_SUCCESS:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case GET_ADDRESS_SUCCESS:
      return {
        ...state,
        userAddress: action.payload,
        isLoading: false
      };
    case GET_ADDRESS_FAIL:
      return {
        ...state,
        userAddress: null,
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
