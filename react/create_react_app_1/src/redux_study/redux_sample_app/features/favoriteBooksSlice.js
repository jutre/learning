/**
 * slice that also updates it's state in response to actions from "booksSlice".
 */
import { createSlice } from '@reduxjs/toolkit';
import { multipleBooksDeleted, fetchBooks } from './booksSlice';

let initialState = {};

const favoriteBooksSlice = createSlice({
  name: 'favoriteBooks',
  initialState,
  reducers: {
    
    //if books is added to favorites, removes it from favorites list and if book present in favorites list, removes it from list
    bookFavoriteStateToggled(state, action){
      
      //in general object prop keys are in form of string, convert possible int type key value to string (would work also with int type)
      let bookIdStrVal = String(action.payload);
      if(state[bookIdStrVal] === true){
        delete state[bookIdStrVal];
      }else{
        state[bookIdStrVal] = true;
      }
    },

  },

  extraReducers: (builder) => {
    builder
      
      //when book(s) are deleted from books state, remove  those deleted from favorites list. 
      //This extra reducer responds to action from other slice
      .addCase(multipleBooksDeleted, (state, action) => {
        let bookIdsArr = action.payload;
        bookIdsArr.forEach((bookId) => {
          if (state[bookId] === true) {
            delete state[bookId];
          }
        })
      })

      //when initial data is loaded then delete all data from current favorite books state. As completely new data is loaded
      //existing favorite books data is unrelevant
      .addCase(fetchBooks.fulfilled, (state, action) => {
        let favoriteBookIds = Object.keys(state);
        favoriteBookIds.forEach((bookId) => {
          delete state[bookId];
        })
      })
  }
});

export const { bookFavoriteStateToggled } = favoriteBooksSlice.actions
export default favoriteBooksSlice.reducer


