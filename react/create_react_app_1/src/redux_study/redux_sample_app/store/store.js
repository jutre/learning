import { configureStore } from '@reduxjs/toolkit'
import booksReducer from '../features/booksSlice';
import filtersReducer from '../features/filtersSlice';
import favoriteBooksReducer from '../features/favoriteBooksSlice'


const store = configureStore({
    reducer: {  books: booksReducer,
                filters: filtersReducer,
                favoriteBooks: favoriteBooksReducer
    }
});

export default store;