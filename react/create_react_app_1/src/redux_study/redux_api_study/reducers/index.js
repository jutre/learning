import { combineReducers } from 'redux';
import todoReducer from './todo';
import forStringValue from './forStringValue';

/*actually need only one object in store root, but for testing what will be in store and selectors, will
use combineReducers() with one reducer empty*/
const rootReducer = combineReducers({
  todoState: todoReducer,
  stringValueState: forStringValue,
});

export default rootReducer;

