import { configureStore } from '@reduxjs/toolkit'
import booksReducer from '../features/booksSlice';
import favoriteBooksReducer from '../features/favoriteBooksSlice'


const store = configureStore({
    reducer: {  booksState: booksReducer,
                favoriteBooksState: favoriteBooksReducer
    }
});

export default store;