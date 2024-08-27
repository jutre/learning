/**
 * This component displays book list from store. It might display all books or 
 * filtered list is search string is set in filters state
 */
import { useSelector } from 'react-redux';
import { routes } from "../config";
import { Link } from "react-router-dom";
import { selectFilteredBooksIds } from "../features/booksSlice";
import { selectSearchString } from "../features/filtersSlice";
import BooksListItemsSelectionBar from "./BooksListItemsSelectionBar"
import { BookListItem } from "./BooksListItem";
//temp for debugging
import store from "../store/store";

function BooksListBody () {

  /**
   * creates deleting url for a book. Adds "search" get param if currently displayed list is search result list.
   * "search" param is added to keep displaying search results list after a selected book is deleted.
   * @param {*} bookId 
   * @param {*} searchGetParamVal 
   * @returns 
   */
  function getBookDeletionUrl(bookId, searchGetParamVal){
    /*carry book id in url for better user experience. When delete button is pressed then confirm
    dialog will be snown. In this situation user might press back on browser and will get to previous 
    page - book list, but if for deleting button would be used click handler and state, clicking back
    user would get to whatever page he previously was but that would not be book list*/
    let deleteUrl = routes.bookListPath + "?deleteId="+ bookId;

    if(searchGetParamVal){
      deleteUrl += "&search=" + searchGetParamVal; 
    }
    return deleteUrl;
  }

  let booksIds = useSelector(state => selectFilteredBooksIds(state));
  let currentSearchString = useSelector(state => selectSearchString(state));


  //create url for link to all records that will be shown when search string not empty
  let allBooksListUrl = routes.bookListPath;


  //add info how much records were found during search
  let searchResultsInfoMessage;
  let searchStrTooShortErrorMessage;
  if (currentSearchString) {
    //ensure search string is of String type to get rid of possible error as we will check length of variable
    currentSearchString = String(currentSearchString);
    
    searchResultsInfoMessage = `Your searched for "${currentSearchString}".`;
    
    if(currentSearchString.length < 3){
      //search phrase length is less than three symbols - 
      //display error message that search phrase must be at least three symbols
      searchStrTooShortErrorMessage = "Searching string must contain at least three symbols"
    
    }else {
        if(booksIds.length === 0){
          searchResultsInfoMessage += " Nothing was found."
        }else{
          searchResultsInfoMessage += ` Number of records found is ${booksIds.length}.`;
        }
    }
  }
  
  console.log('BooksListBody render, state', store.getState(), "ids", booksIds);
  return  (
    <>
      <div className="list">
        
        {//always display entered search phrase and possible results (if search string not too short)
          searchResultsInfoMessage &&
          <div className="search_results_summary">
            {searchResultsInfoMessage}
          </div>
        }

        {//dispay error if search string too short
          searchStrTooShortErrorMessage &&
          <div className='error'>{searchStrTooShortErrorMessage}</div>
        }

        {//finally link to all records
        searchResultsInfoMessage &&
          <div className="search_results_summary">
            <Link to={allBooksListUrl}>Display all records</Link>
          </div>
        }

        {//if books array is empty and no searching is done (it might be the case nothing is found), offer adding some books 
          (booksIds.length === 0 && !currentSearchString) &&
          <div>There are no books added yet. Add them by using "Add book" link!</div>
        }
        
        {booksIds.length > 0 &&
          <>
            <BooksListItemsSelectionBar booksIds={booksIds} 
                                        searchGetParamVal={currentSearchString}/>
            
            {(booksIds).map(bookId =>
              <BookListItem key={bookId} 
                            bookId={bookId}
                            deleteUrl={getBookDeletionUrl(bookId, currentSearchString)} />
            )}
          </>
        }
      </div>
    </>
  )
}

export default BooksListBody;