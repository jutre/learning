import { createSlice } from '@reduxjs/toolkit';

let initialState = [];
for (let i = 1; i <= 10; i++){
  initialState.push({
    id: i, 
    title: "This is sample title for book, we have some more text here in title " + i,
    description: "Book " + i + " description text here"})
}
//----------
initialState= [];
initialState.push({
  id: 1, 
  title: "Calculus, part one",
  description: "Calculus, part one - description text here"})
  
  initialState.push({
    id: 2, 
    title: "Calculus, part two",
    description: "Calculus, part two description text here"})
      
  initialState.push({
    id: 3, 
    title: "Calculus, part three",
    description: "Calculus, part three description text here"})
      
  initialState.push({
    id: 4, 
    title: "The basics of physics",
    description: "The basics of physics description text here"})

  initialState.push({
      id: 5, 
      title: "Tranzistor circuit basics",
      description: "Tranzistor circuit basics description text here"})
//--------
const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    bookUpdated(state, action){
      const bookId = action.payload.id; 
 
      /*when object for update is found, map() function must return newly created object with updated properties. 
        We can't just modify object that was referenced to from previous state array as react-redux connect()
        function will not detect that update */
      const newState = state.map((book) => {
        if(book.id === bookId){
          let newSameObject = {...book};
          return Object.assign(newSameObject, action.payload);
        }
        return book;
      })

      return newState;
    },


    bookDeleted(state, action){
      return state.filter( book => book.id !== action.payload)
    },


    bookCreated(state, action){
      let newBookId = nextBookId(state);
      let bookDataWithId = {...action.payload, id: newBookId};
      return [ ...state, bookDataWithId];
    }

  }
});

export const { bookUpdated, bookDeleted, bookCreated } = booksSlice.actions

export default booksSlice.reducer

function nextBookId(books) {
  const maxId = books.reduce((maxId, book) => Math.max(book.id, maxId), -1)
  return maxId + 1
}

