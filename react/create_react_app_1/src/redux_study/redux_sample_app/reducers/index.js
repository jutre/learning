import { combineReducers } from 'redux';
import booksReducer from './books';

const rootReducer = combineReducers({
  booksState: booksReducer
});

export default rootReducer;

