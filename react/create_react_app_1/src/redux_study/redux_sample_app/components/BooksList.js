import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import { routes } from "../config";
import { getAllBooksIds, selectBookIdsByTitle } from "../features/booksSlice";
import { BookListItem } from "./BooksListItem";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";
import { getQueryParamValue } from "../utils/utils";
import { BookDeletionConfirmationDialog } from "./BookDeletionConfirmationDialog";
import store from "../store/store";

function BooksList () {

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

  //it is needed to call a hook from react-router to cause this component to re-render when react-router generated 
  //links are changed. The changing part or link for current page is adding, removing deleteId parameter
  useLocation();

  const [hadDeleteLink, setHadDeleteLink] = useState("false");
  
  useEffect(() => {
    setPageTitleTagValue("Books");
  }, []);

  let booksIds = useSelector(state => getAllBooksIds(state));

  

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
      booksIds = [];
      errorMessageStrPlaceholder = "Searching string must contain at least three symbols"
    
    }else{
      
      //here store is accessed directly to get state as we need the selector only in those case is search form is submitted
      //that's why we can't use useSelector hook as it can't be called conditionally. This will not cause to show outdated data in
      //this page, as if user deletes a record from a found books list, component will re-render because at the beginning all books
      //list is fetched using useSelector hook
      booksIds = selectBookIdsByTitle(store.getState(), searchStringParamVal);

      //add info how much records were found
      if(booksIds.length === 0){
        selectedForSearchMessageStr += " Nothing was found."
      }else{
        selectedForSearchMessageStr += ` Number of records found is ${booksIds.length}.`;
      }
    }
  }


  let displayDeletionConfirmationDialog = false;
  let deleteBookIdParamVal = getQueryParamValue("deleteId");
  let deleteBookId = 0;
  //the url of book list user will be redirected after he confirms book deleting. This is basic url, search params might be added later 
  let afterDeletingRedirectUrl = routes.bookListPath;
  
  if (deleteBookIdParamVal) {

    //delete id must be positive integer, reject non integer and values less than one by displaying error message
    if (!/^[1-9][0-9]*$/.test(deleteBookIdParamVal)) {
      errorMessageStrPlaceholder = `Invalid "deleteId" parameter value "${deleteBookIdParamVal}"! Value must be integer greater than zero.`;

    } else {
      deleteBookId = parseInt(deleteBookIdParamVal);
      //if deleteId value is a positive integer, display a dialog confirmation modal dialog component - besides confirmation dialog displaying
      //and deleting or canceling deletion depending on user actions it will also check if selected book for deletion exists. We can't check 
      //if book exists in this component here because we can't conditionally invoke react-redux.useSelector hook, but we need deletable book
      //info only on deleting
      if (deleteBookId > 0) {
        if(hadDeleteLink === "false")
          setHadDeleteLink("yes")
        displayDeletionConfirmationDialog = true;
        //if search params is entered then add is to book list page to display list with search string user entered before 
        //choosing deleting option and to list books that are still found by search string 
        if(searchStringParamVal){
          afterDeletingRedirectUrl += "?search=" + searchStringParamVal;
        }
      }
    }
  }

  
  
  
  
console.log('state is', store.getState());
  return  (
    <div className="book_list">
      <h2>Books</h2>{hadDeleteLink}
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

      {//add deletion confirmation dialog here as error message from dialoag in book is not found should
       //be placed before book list
      displayDeletionConfirmationDialog &&
        <BookDeletionConfirmationDialog bookId={deleteBookId} 
          afterDeletingRedirectUrl={afterDeletingRedirectUrl} cancelActionUrl={routes.bookListPath}/>
      }

      <div className="list">
        {//if books array is empty and no searching is done (it might be the case nothing is found), offer adding some books 
         (booksIds.length === 0 && !searchStringParamVal)&& 
          <div>There are no books added yet, please add one!</div>
        }
        {booksIds &&
          (booksIds).map(bookId =>
            <BookListItem key={bookId} bookId={bookId} 
            deleteUrl={getBookDeletionUrl(bookId, searchStringParamVal)}/>
          )
        }
      </div>
      
      
    </div>
  )
}


export default BooksList;