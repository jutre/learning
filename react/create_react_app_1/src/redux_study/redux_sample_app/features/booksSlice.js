import {  createSlice, 
          createEntityAdapter, 
          createSelector, 
          createAsyncThunk } from '@reduxjs/toolkit';
import { getBooksInitialData } from "../client/client";
import { FAVORITE_BOOKS_LIST } from "../constants/bookListModes";

//async thunk status that is keeded in state is used in some components. Create constants for 
//purpose of comparing status values where status value are used for conditions
export const STATUS_LOADING = "loading";
export const STATUS_IDLE = "idle";
export const STATUS_REJECTED = "rejected"


const booksAdapter = createEntityAdapter();

let initialState = booksAdapter.getInitialState({
  status: 'idle',
})

export const fetchBooks = createAsyncThunk('books/fetchTodos', async (url) => {
  const response = await getBooksInitialData(url);
  return response.books;
})

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    bookUpdated(state, action){
      //ensure entity id field is of int type 
      const bookId = parseInt(action.payload.id);
      let newData = {...action.payload}; 
      //removing id property from update object to prevent updating id of existing entity in state
      delete newData["id"];
      let updateObj = { id: bookId, changes: newData }
      booksAdapter.updateOne(state, updateObj)
    },


    bookDeleted:booksAdapter.removeOne,

    //action for deleting multiple books
    multipleBooksDeleted(state, action){
      let bookIdsArr = action.payload;
      bookIdsArr.forEach((bookId)=>{
        booksSlice.caseReducers.bookDeleted(state, { type: 'bookDeleted', payload: bookId });
      })
    },

    bookCreated:{
      reducer:(state, action) => {
        booksAdapter.addOne(state, action);
      },

      //generate id property for book before saving
      prepare: (value) => {
        const date = new Date();
        const timeStr = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
        const id = parseInt(timeStr);
        return { payload: {...value, id: id} }
      }
    },

    //for resetting "status" state from "rejected" to "idle" to clear "rejected" status when user navigates
    //to some other page
    statusSetToIdle(state){    
      state.status = STATUS_IDLE;
    }

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state, action) => {
        state.status = STATUS_LOADING
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        booksAdapter.setAll(state, action.payload)
        state.status = STATUS_IDLE
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = STATUS_REJECTED
      })
  }
});

export const { bookUpdated, multipleBooksDeleted, bookCreated, statusSetToIdle } = booksSlice.actions 

export default booksSlice.reducer


//
//selectors
//
export const {
  selectById: getBookById,
  selectIds: getAllBooksIds,
  selectAll: getAllBooks,
  selectEntities: getBookEntities
} = booksAdapter.getSelectors((state) => state.books)


export const selectBookFullInfoById = createSelector(
  //input selector - book info from books state
  getBookById,
  //input selector - presence of book in favorite books state
  (state, bookId) => state.favoriteBooks[bookId],
  //input selector - presence of book in selection for deleting state
  (state, bookId) => state.uiControls.booksSelectedInList[bookId],
  (bookInfo, addedToFavorites, selectedForDeleting) => {
    let fullBookInfo = {...bookInfo};
    fullBookInfo["isAddedToFavorites"] = addedToFavorites === true;
    fullBookInfo["isSelectedForDeleting"] = selectedForDeleting === true;
    return fullBookInfo;
  }
)

/**
 * Function that implements actual search algorithm - performs search in array of book objects for objects where "title" field 
 * has a substring equal to parameter's "searchStr" value. 
 * Function is used in two different selectors which do same search logic but receive input parameters in different way
 * 
 * @param {array of objects} booksArr - books array to be filtered by title fields. Each object must contain "title" field
 * @param {string} searchStr - string to be searched in book.title field
 * @returns book array consisting of books where "title" field has a substring equal to parameter's "searchStr" value
 */
const performSearchByTitle = (booksArr, searchStr) => {
  //don't perform any filtering if search string value is falsey (null,undefined, empty string), return whole list.
  //This behaviour is what is needed when current function is invoked in selector used in book list component, in
  //this case selector returns whole book list without filtering - the value of search string in filters state is null when
  //not any filtering is done. Such result would not fit for selector that is used for autocomplete search bar component result list
  //but it is possible to use current function in that selector in other cases as no searching is done (selector is not invoked) until 
  //user inputs at least three symbols
  if(!searchStr){
    return booksArr;
  }
  //ensure input parameter is string type to invoke trim() function
  searchStr = String(searchStr);

  //return unfiltered book list if search string value after trimming is empty string. This if what is needed for selector
  //used in book list component - when user submits search form with search string containing only whitespaces, this input is ignored
  //as filter value. For selector used for autocomplete search bar this result is not used as no searching is done until 
  //user inputs at least three symbols
  searchStr = searchStr.trim();
  if (searchStr === "") {
    return booksArr;

  //return empty book list if search string not empty but length is less than three symbols. In such case display empty book list in 
  //book list component (then also message is displayed that seach string must be of length of at least three symbols). In case of 
  //autocomplete search bar this result is not used as no searching is done until user inputs at least three symbols
  }else if (searchStr.length === 2 || searchStr.length === 2) {
    return [];
  }

  return booksArr.filter((book)=>
    book.title.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1
  )
}
/**
 * returns array of book objects where book title contains a search string. This selector is intended to use in
 * autocomplete search bar where search string is obtained from input form, books must be filtered while user
 * types, so this selector has two input parameters: state and search string to search in title
 */
export const selectBooksListByTitle = createSelector(
  //input selector - all books from current slice
  getAllBooks,
  //input selector - returns second argument of parent selector to transformation function
  (state, searchStr) => searchStr,
  (books, searchStr) => {
    return performSearchByTitle(books, searchStr)
  }
)

/**
 * selects books from state filtered by title field using search string residing in filters state or returns favorite books.
 * Books list state array if filtered using search string or favorite books are returned depending on second parameter of selector
 * "listMode"
 * 
 * @param {string} listMode - empty of equal to FAVORITE_BOOKS_LIST constant
 * 
 */
const selectFilteredBooks = createSelector(
  //input selector - all books from current slice
  getAllBooks,
  
  //input selector - get filters state
  (state) => state.filters,
  
  //input selector - returns second argument of parent selector to transformation function
  (state, listMode) => listMode,
  
  //input selector - returns favourites books state to transformation function only if second argument of parent selector 
  //is equal to favorite book list mode. Output selector needs favorite books state only in case of selecting only favorites 
  //books, it would not be optimal to return favorites state object to transformation function when all books are selected 
  //as in this case output selector would run every time a book is added or removed from favorites list - it would cause
  //unnecesary re-renders. Favorite books information is used only while displaying favorite books list
  (state, listMode) => listMode === FAVORITE_BOOKS_LIST && state.favoriteBooks,
  
  (books, filters, listMode, favoriteBooksObj) => {
    if (listMode){
      return books.filter((book)=>favoriteBooksObj[book.id] === true);
    }else{
      return performSearchByTitle(books, filters.searchString);
    }
  }
);




export const selectFilteredBooksIds = createSelector(
  
  //input selector - filtered books 
  (state, listMode) => selectFilteredBooks(state, listMode),
  (booksObjArr) => {
    return booksObjArr.map((book)=> book.id)
  }
);

/**
 * status for fetching books from remore source, used for loading indicator
 * @param {*} state 
 * @returns 
 */
export const selectBooksFetchingStatus = (state) => state.books.status