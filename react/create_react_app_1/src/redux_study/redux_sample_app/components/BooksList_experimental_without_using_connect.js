import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../config";
import { getAllBooks } from '../selectors/books';
import { doDeleteBook } from '../actions/bookActions';
import { ModalDialog } from './ModalDialog';
import store from "../store/store";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";

/**
 * This is experiment of using Redux without using react-redux/connect() function. The connect()
 * function is not used but other things (reducers and selectors) remain exactly same way
 */

function BooksList () {

  //use state instead of component property, the state will be assigned book array from store
  const [booksArr, setBooksArr] = useState([]); 
  
  useEffect(() => {
    setPageTitleTagValue("Books");

    /*This is what is done instead of using react-redux/connect() for tracking state updates. 
    Subscription to redux store using store's subscribe() and initial loading of data to component's state.
    On state change in store, books state from store will be assigned to compoent's state
    using selector function formerly used in connect()*/
    store.subscribe(() => {
      let books = getAllBooks(store.getState());
      setBooksArr(books);
    });
    //initial loading of data
    let books = getAllBooks(store.getState());
    setBooksArr(books);

  }, []);

  /*this is our function for dispatching actions. Using our action creator inside, previously it  
  was passed as prop to component using connect() function*/
  function onBookDelete(bookId) {
    store.dispatch(doDeleteBook(bookId))
  }
  
  const navigate = useNavigate();
  /**
   * deletes book in redux store and redirects to book list url.
   * Intended to call from modal confirmation dialog on "Confirm" button
   */
  function deleteBook(bookId){
    onBookDelete(bookId);
    //restore page title tag
    setPageTitleTagValue("Books");
    navigate(routes.bookListPath);
  }

  /**
   * redirects to book list page without params that way no book is selected 
   * for deletion
   */
  function cancelSelectionForDeleting(){
    //restore page title tag
    setPageTitleTagValue("Books");
    navigate(routes.bookListPath);
  }

  
  //book is selected for deletion - initialise confirmation dialog for inserting later in html
  let showModalDialog = false;
  //vars must be defined here to be reachable in jsx
  let modalDialogMessage;
  let deletionErrorMessage;
  const { search: queryParamsString } = useLocation();
  let deleteBookId = (new URLSearchParams(queryParamsString)).get("deleteId");
  //try to get and integer from parameter value
  deleteBookId = parseInt(deleteBookId);
  if(deleteBookId){
    /*place the title of selected book in confirmation dialog. 
    Aso check if book for deletion exists, maybe user got to current url from browser history 
    when he deleted book previously*/
    const selectedBook = booksArr.find(
      (book) => book.id === deleteBookId
    );
    
    if(selectedBook){
      modalDialogMessage = `Are you sure you want to delete "${selectedBook.title}"?`;
      showModalDialog = true;

      //on modal dialog change page title
      setPageTitleTagValue("Delete book");
    }else{
      deletionErrorMessage = `A book with id="${deleteBookId}" was not found!`;
    }
  }


  return  (
    <div className="book_list">
      <h2>Books</h2>
      <div className="add_book_link">
        <Link to={routes.createBookPath}>Add book</Link>
      </div>

      {deletionErrorMessage&&
        <div className='error'>{deletionErrorMessage}</div>}

      <div className="list">
        {(booksArr || []).map(elem  => {
          //replace bookId segment in book edit route pattern
          let editUrl = routes.bookEditPath.replace(":bookId", elem.id);

          /*carry book id in url for better user experience. When delete button is pressed then confirm
          dialog will be snown. In this situation user might press back on browser and will get to previous 
          page - book list, but if for deleting button would be used click handler and state, clicking back
          user would get to whatever page he previously was but that would not be book list*/
          let deleteUrl = routes.bookListPath + `?deleteId=${elem.id}`;
        
          return (
            <div key={elem.id} className="item">
              <div className="title">{elem.title}</div>
              <div className="actions">
                <div className="button edit"><Link to={editUrl}></Link></div>
                <div className="button delete"><Link to={deleteUrl}></Link></div>
              </div>
            </div>)}
        )}
      </div>
      
      {showModalDialog&&
        <ModalDialog  content={modalDialogMessage}
        confirmFunction={()=>deleteBook(deleteBookId)} 
        cancelFunction={cancelSelectionForDeleting}/>}
    </div>
  )
}




export default BooksList;