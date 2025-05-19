import { combineReducers } from 'redux';
import tokenSlice from './tokenSlice';

const rootReducer = combineReducers({
  token : tokenSlice
});

export default rootReducer;