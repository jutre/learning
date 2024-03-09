function getAllBooks(state) {
    return state.booksState;
}

const getBookById = (state, id) => {
    id = parseInt(id);
    const selectedBook = state.booksState.find(
      (book) => book.id === id
    );
    return selectedBook;
  };

export { getAllBooks, getBookById }

