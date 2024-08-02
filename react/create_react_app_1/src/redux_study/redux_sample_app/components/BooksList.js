import { useEffect } from "react";
import { connect } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { routes } from "../config";
import { getAllBooks } from '../selectors/books';
import { bookDeleted } from "../features/booksSlice";
import { ModalDialog } from './ModalDialog';
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";
import { searchBooks } from "../utils/utils";


/**
 * returns value of get parameter from window current location string. If parameter is not present in window.location string, returs null
 * 
 * @param {string} paramName - name of parameter 
 * @returns {string | null} 
 */
function getQueryParamValue(paramName){
  const  queryParamsString  = window.location.search;
  let paramValue = (new URLSearchParams(queryParamsString)).get(paramName);
  return paramValue;
}

function BooksList ({ booksArr, onBookDelete }) {
  useEffect(() => {
    setPageTitleTagValue("Books");
  }, []);
  
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

  //used for showing error messages in needed situations
  let errorMessageStrPlaceholder;
  

  //search parameter is passed
  let selectedForSearchMessageStr;
  let searchStringParamVal = getQueryParamValue("search");
  let allBooksListUrl;

  //if length is zero after trimming, ignore it, set search string to null to prevent entering the search block
  if(searchStringParamVal){
    searchStringParamVal = searchStringParamVal.trim();
    if(searchStringParamVal.length === 0){
      searchStringParamVal = null;
    }
  }

  if(searchStringParamVal){
    //if search string after whitespace trimming is not empty, always show entered search string and link to all records link
    allBooksListUrl = routes.bookListPath;

    selectedForSearchMessageStr = `Your searched for "${searchStringParamVal}".`;

    //search phrase length is less than three symbols - searching is not performed in such case, 
    //display error message that search phrase must be at least three symbols, display empty book list
    if(searchStringParamVal.length < 3){
      booksArr = [];
      errorMessageStrPlaceholder = "Searching string must contain at least three symbols"
    
    }else{
      
      //add info how much records were found
      booksArr = searchBooks(booksArr, searchStringParamVal);
      if(booksArr.length === 0){
        selectedForSearchMessageStr += " Nothing was found."
      }else{
        selectedForSearchMessageStr += ` Number of records found - ${booksArr.length}.`;
      }
    }
  }
  
  
  //book is selected for deletion, initialise confirmation modal dialog
  let showModalDialog = false;
  let modalDialogMessageStr;
  let deleteBookIdParamVal = getQueryParamValue("deleteId");
  let deleteBookId = 0;
  if(deleteBookIdParamVal){
    //exclude non integer and values less than one
    if( ! /^[1-9][0-9]*$/.test(deleteBookIdParamVal)){
      errorMessageStrPlaceholder = deleteBookIdParamVal +" - invalid parameter value! Value must be integer greater than zero.";
    }else{
      deleteBookId = parseInt(deleteBookIdParamVal);
    }
  }

  if(deleteBookId > 0){
    /*place the title of selected book in confirmation dialog. 
    Aso check if book for deletion exists, maybe user got to current url from browser history 
    when he deleted book previously*/
    const selectedBook = booksArr.find(
      (book) => book.id === deleteBookId
    );
    
    if(selectedBook){
      modalDialogMessageStr = `Are you sure you want to delete "${selectedBook.title}"?`;
      showModalDialog = true;

      //on modal dialog change page title
      setPageTitleTagValue("Delete book");
    }else{
      errorMessageStrPlaceholder = `A book with id="${deleteBookId}" was not found!`;
    }
  }

  return  (
    <div className="book_list">
      <h2>Books</h2>
      <div className="add_book_link">
        <Link to={routes.createBookPath}>Add book</Link>
      </div>

      

      {selectedForSearchMessageStr &&
        <div className="search_results_heading">
          <div><Link to={allBooksListUrl}>Display all records</Link></div>
          <div className="entered_search_string_message">{selectedForSearchMessageStr}</div>
        </div>
      }


      {errorMessageStrPlaceholder &&
        <div className='error'>{errorMessageStrPlaceholder}</div>
      }

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
        <ModalDialog  content={modalDialogMessageStr}
        confirmFunction={()=>deleteBook(deleteBookId)} 
        cancelFunction={cancelSelectionForDeleting}/>}
    </div>
  )
}

const mapStateToProps = state => ({
  booksArr: getAllBooks(state)
});



const mapDispatchToProps = dispatch => ({
  onBookDelete: bookId => dispatch(bookDeleted(bookId)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BooksList);