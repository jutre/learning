import { configureStore } from '@reduxjs/toolkit'
import booksReducer from '../features/booksSlice';


const store = configureStore({
    reducer: {booksState: booksReducer}
});

export default store;