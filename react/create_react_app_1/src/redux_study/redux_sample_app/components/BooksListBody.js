/**
 * This component displays book list from store. It might display all books or 
 * filtered list is search string is set in filters state
 */
import { useSelector } from 'react-redux';
import { routes } from "../config";
import { Link } from "react-router-dom";
import { selectFilteredBooksIds } from "../features/booksSlice";
import { selectSearchString } from "../features/filtersSlice";
import { BookListItem } from "./BooksListItem";

function BooksListBody () {

  /**
   * generates deleting url for a book. Besides adding "deleteId" get param to all urls, also adds "search" get param is user is on
   * search result list. "search" param is added to keep search string that was entered before user clicked delete link to show books 
   * that still match search criteria after deleting
   * @param {*} bookId 
   * @param {*} searchStringParamVal 
   * @returns 
   */
  function getBookDeletionUrl(bookId, searchStringParamVal){
    /*carry book id in url for better user experience. When delete button is pressed then confirm
    dialog will be snown. In this situation user might press back on browser and will get to previous 
    page - book list, but if for deleting button would be used click handler and state, clicking back
    user would get to whatever page he previously was but that would not be book list*/
    let deleteUrl = routes.bookListPath + "?deleteId="+ bookId;

    if(searchStringParamVal){
      deleteUrl += "&search=" + searchStringParamVal; 
    }
    return deleteUrl;
  }


  let booksIds = useSelector(state => selectFilteredBooksIds(state));
  let enteredSearchString = useSelector(state => selectSearchString(state));


  //create url for link to all records that will be shown when search string not empty
  let allBooksListUrl = routes.bookListPath;

  //add info how much records were found during search
  let searchResultsInfoMessage;
  let errorMessageStrPlaceholder;
  if (enteredSearchString) {
    //ensure search string is of String type to get rid of possible errory as we will check length of variable
    enteredSearchString = String(enteredSearchString);
    
    searchResultsInfoMessage = `Your searched for "${enteredSearchString}".`;
    
    if(enteredSearchString.length < 3){
      //search phrase length is less than three symbols - 
      //display error message that search phrase must be at least three symbols
      errorMessageStrPlaceholder = "Searching string must contain at least three symbols"
    
    }else {
        if(booksIds.length === 0){
          searchResultsInfoMessage += " Nothing was found."
        }else{
          searchResultsInfoMessage += ` Number of records found is ${booksIds.length}.`;
        }
    }
  }
  
  return  (
    <>
      <div className="list">

        {searchResultsInfoMessage &&
          <div className="search_results_heading">
            <div className="entered_search_string_message">{searchResultsInfoMessage}</div>
          </div>
        }

        {errorMessageStrPlaceholder &&
          <div className='error'>{errorMessageStrPlaceholder}</div>
        }

        {searchResultsInfoMessage &&
          <div className="search_results_heading">
            <div className="entered_search_string_message">
              <Link to={allBooksListUrl}>Display all records</Link>
            </div>
          </div>
        }

        {//if books array is empty and no searching is done (it might be the case nothing is found), offer adding some books 
          (booksIds.length === 0 && !enteredSearchString) &&
          <div>There are no books added yet. Add them by using "Add book" link!</div>
        }
        
        {booksIds &&
          (booksIds).map(bookId =>
            <BookListItem key={bookId} bookId={bookId}
              deleteUrl={getBookDeletionUrl(bookId, enteredSearchString)} />
          )
        }
      </div>
    </>
  )
}

export default BooksListBody;