import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
const booksAdapter = createEntityAdapter();


let initialState = {ids:[1,2,3,4,5], entities:{}};


initialState.entities["1"]={
  id: 1, 
  title: "Calculus, part one",
  description: "Calculus, part one - description text here"};
  
initialState.entities["2"]={
    id: 2, 
    title: "Calculus, part two",
    description: "Calculus, part two description text here"};
      
initialState.entities["3"]={
    id: 3, 
    title: "Calculus, part three",
    description: "Calculus, part three description text here"};
      
initialState.entities["4"]={
    id: 4, 
    title: "The basics of physics",
    description: "The basics of physics description text here"};

initialState.entities["5"]={
      id: 5, 
      title: "Tranzistor circuit basics",
      description: "Tranzistor circuit basics description text here"};
//--------
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    bookUpdated(state, action){
      //ensure entity id field is of int type 
      const bookId = String(action.payload.id);
      let newData = {...action.payload}; 
      //removing id property from update object to prevent updating id of existing entity in state
      delete newData["id"];
      let updateObj = { id: bookId, changes: newData }
      booksAdapter.updateOne(state, updateObj)
    },


    bookDeleted:booksAdapter.removeOne,

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
    }

  }
});

export const { bookUpdated, bookDeleted, bookCreated } = booksSlice.actions
//for access to current slice actions in favoriteBooksSlice
export { booksSlice } 

export default booksSlice.reducer


//
//selectors
//
export const {
  selectById: getBookById,
  selectIds: getAllBooksIds,
  selectAll: getAllBooks,
  selectEntities: getBookEntities
} = booksAdapter.getSelectors((state) => state.booksState)

/**
 * returns array of book objects where book title contains a search string
 */
export const selectBooksByTitle = createSelector(
  //input selector - all books
  getAllBooks,
  //input selector - just returns second argument of parent selector to transformation function
  (state, searchStr) => searchStr,
  (books, searchStr) => {
    searchStr = searchStr.trim();
    //don't perfoms searching if search text less than three symbols
    if (searchStr.length < 3) {
      return [];
    }

    return books.filter((book)=>{
      return book.title.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1;
    })
  }
);

/**
 * returns array of book ids by extractin it from selectBooksByTitle result
 */
export const selectBookIdsByTitle = createSelector(
  //input selector - all books with matching title
  selectBooksByTitle,
  (booksObjArr) => {
    return booksObjArr.map((book)=> book.id)
  }
);

