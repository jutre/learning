/**
 * This component is dedicated for processing get parameters for book list component: search string param and book delete id param.
 * Search param value is assigned to redux store; in response to delete id param delete confirm modal dialog markup is displayed.
 * 
 * Parameter processing is done in separate component because in response to url change component that uses react-router api
 * for url processing is re-rendering, it would not be optimal to process parameters where book list is displayed because the whole
 * list would re-render on, for example, an url with deleting param when deletion confirm dialog is displayed would cause to re-render
 * the book list while list is not modified yet; if then user cancels deleting then list would re-render again as delete id param is
 * removed from url 
 */
import { useEffect } from "react";
import { useDispatch } from 'react-redux'; 
import { searchStringUpdated } from "../features/filtersSlice"
import { useLocation } from "react-router-dom";
import { routes } from "../config";
import { getQueryParamValue } from "../utils/utils";
import { BookDeletionConfirmationDialog } from "./BookDeletionConfirmationDialog";


function BooksListParamProcessor () {
  const dispatch = useDispatch();

  //it is needed to call a hook from react-router to cause this component to re-render when react-router generated 
  //links are changed. The changing part or link for current page is adding, removing deleteId parameter
  useLocation();
  
  //used for showing error messages
  let errorMessageStrPlaceholder;
  
  let searchStringParamVal = getQueryParamValue("search");
  
  //
  //process entered search string value - trim whitespaces. If search string length after trimming is zero, ignore it by setting it
  //to null to prevent trigering conditions for entered search string further.
  //Further in code in useEffect hook set value of searchStringParamVal variable to filters state in Redux store
  //
  if(searchStringParamVal){
    searchStringParamVal = searchStringParamVal.trim();
    if(searchStringParamVal.length === 0){
      searchStringParamVal = null;

    }
  }

  //set search string to filters state is Redux store if search string changed; happens after component renders
  useEffect(() => {
    dispatch(searchStringUpdated(searchStringParamVal));
  }, [searchStringParamVal]);


  //
  //process book deletion get parameter in url 
  //
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
      //if deleteId value is a positive integer, display deletion confirmation modal dialog component - besides confirmation dialog displaying
      //and deleting or canceling deletion depending on user actions it will also check if selected book for deletion exists. We can't check 
      //if book exists in this component here because we can't conditionally invoke react-redux.useSelector hook, but we need info about
      //deletable book only on deleting
      if (deleteBookId > 0) {
        displayDeletionConfirmationDialog = true;
        //if search params is entered then add is to book list page to display list with search string user entered before 
        //choosing deleting option and to list books that are still found by search string 
        if(searchStringParamVal){
          afterDeletingRedirectUrl += "?search=" + searchStringParamVal;
        }
      }
    }
  }

  return  (
    <>
      {errorMessageStrPlaceholder &&
        <div className='error'>{errorMessageStrPlaceholder}</div>
      }

      {//add deletion confirmation dialog here as error message from dialoag in book is not found should
       //be placed before book list
      displayDeletionConfirmationDialog &&
        <BookDeletionConfirmationDialog bookId={deleteBookId} 
          afterDeletingRedirectUrl={afterDeletingRedirectUrl} cancelActionUrl={routes.bookListPath}/>
      }
      
    </>
  )
}

export default BooksListParamProcessor;