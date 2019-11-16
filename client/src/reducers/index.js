//Root Reducer for Redux, combines all other reducers into our root reducer
import { combineReducers } from "redux";
import userReducer from "./userReducer";
import libraryReducer from "./libraryReducer";

export default combineReducers({
  user: userReducer,
  library: libraryReducer
});
