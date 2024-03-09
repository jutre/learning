import { BOOK_UPDATE } from '../constants/actionTypes';
import { BOOK_DELETE } from '../constants/actionTypes';
import { BOOK_CREATE } from '../constants/actionTypes';

const initialState = [];

for (let i = 1; i <= 10; i++){
  initialState.push({
    id: i, 
    title: "This is sample title for book, we have some more text here in title " + i,
    description: "Book " + i + " description text here"})
}

function booksReducer(state = initialState, action) {
  switch(action.type) {
    case BOOK_UPDATE : {
      return applyUpdateBook(state, action);
    }
    case BOOK_DELETE : {
      return applyDeleteBook(state, action);
    }
    case BOOK_CREATE : {
      return applyCreateBook(state, action);
    }
    
    
    default : return state;
  }
}

/**
 * 
 * @param {object} state 
 * @param {object} action - action.updatedBookData contains objec with updated book data 
 * @returns 
 */
function applyUpdateBook(state, action) {
  const bookId = action.updatedBookData.id; 
 
  /*when object for update is found, map() function must return newly created object with updated properties. 
    An existing object's properties can not be just modified react-redux connect()
    function will not detect state update*/
  const newState = state.map((book) => {
    if(book.id === bookId){
      let newSameObject = {...book};
      return Object.assign(newSameObject, action.updatedBookData);
    }
    return book;
  })

  return newState;
}

/**
 * 
 * @param {object} state 
 * @param {object} action - action.bookId contains id of book that should be removed from state array 
 * @returns 
 */
function applyDeleteBook(state, action){
  return state.filter( book => book.id !== action.bookId)
}


function applyCreateBook(state, action){
  //generate unique id using current time
  let date = new Date();
  let newBookId = parseInt("" + date.getHours() + date.getMinutes() + date.getSeconds() +  date.getMilliseconds());
  let bookDataWithId = {...action.bookData, id: newBookId};
  return [ ...state, bookDataWithId];
}

export default booksReducer;