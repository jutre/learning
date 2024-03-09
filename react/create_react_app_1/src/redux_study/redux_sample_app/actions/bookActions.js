import { BOOK_UPDATE } from '../constants/actionTypes';
import { BOOK_DELETE } from '../constants/actionTypes';
import { BOOK_CREATE } from '../constants/actionTypes'

/**
 * 
 * @param object newBookData - book with updated properties
 * @returns 
 */
const doUpdateBook = updatedBookData => ({
  type: BOOK_UPDATE,
  updatedBookData: updatedBookData
});

const doDeleteBook = bookId => ({
  type: BOOK_DELETE,
  bookId: bookId
});

const doCreateBook = bookData => ({
  type: BOOK_CREATE,
  bookData: bookData
});

export {
    doUpdateBook, doDeleteBook, doCreateBook
};