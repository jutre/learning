/**
 * slice that also updates it's state in response to actions from "booksSlice"
 */
import { createSlice } from '@reduxjs/toolkit';
import { booksSlice } from './booksSlice';

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
      
      //when book is deleted from books state, remove it from favorites list. 
      //This extra reducer responds to action from other slice
      .addCase(booksSlice.actions.bookDeleted, (state, action) => {
        
        //in general object prop keys are in form of string, convert possible int type key value to string (would work also with int type)
        let bookIdStrVal = String(action.payload);
        if(state[bookIdStrVal] === true){
          delete state[bookIdStrVal];
        }
      })
  }
});

export const { bookFavoriteStateToggled } = favoriteBooksSlice.actions
export default favoriteBooksSlice.reducer

//
//selectors
//
export const isBooksAddedToFavorites = (state, bookId) => {
  //accessing object props using brackets notation would work also with int type keys, but as in general object props keys
  //may be in form of string int type key value is converted to string before using this value in brackets notation
  let bookIdStrVal = String(bookId);
  return state.favoriteBooks[bookIdStrVal] === true;
}

