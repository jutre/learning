import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQueryParamValue } from "../utils/utils";
import {
  bookUpdated,
  getBookById,
  selectBooksFetchingStatus,
  STATUS_IDLE
} from "../features/booksSlice";
import { useSelector } from 'react-redux';
import store from "../store/store";
import { routes } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";
import { BookDeletionConfirmationDialog } from "./BookDeletionConfirmationDialog";


/**
 * This component gets initial data from Redux store but does not use react-redux connect() because we don't need 
 * re-render component after store's state is updated because the new state corresponds to values is that is 
 * currently in input fields.
 */
function BookEditing() {
  const [submitingIndicator, setSubmitingIndicator] = useState(false);
  
  //load book data from store and keep in compnent's state. Components state is needed as component
  //will be re-rendered when submitting indicator will appear and we need a way to perform data loading only once
  const [formInitialData, setFormInitialData] = useState();

  //will contain possible errors
  const [errorMsg, setErrorMsg] = useState();

  let fetchingStatus = useSelector(state => selectBooksFetchingStatus(state));

  const { bookId } = useParams();

  //this hook is used to populate form's fields with initial data. It's dependancy if book's state fetching status, 
  //the actual data selection from store is done when fetching status becomes "idle". Such dependancu is created
  //for case when application is initially opened using url corresponding to book editing page, like "/1/edit/"
  //which means that initial data has not been loaded before, the initial data loading might still be in progress,
  //the book data is selected from store only at moment when fetching status is "idle". If data loading state 
  //is in "loading" or "rejected" state, current page does not show form, the loading status is displayed in other
  //compoent
  useEffect(() => {
    //check if bookId segment is positive integer
    if (! /^[1-9][0-9]*$/.test(bookId)) {
      setErrorMsg(bookId + " - invalid parameter value! Value must be integer greater than zero.");

    } else {
      if(fetchingStatus === STATUS_IDLE){
        let bookIdIntVal = parseInt(bookId);
        
        //here a Redux state in store is accessed directly instead of using useSelector. The reason for that is that 
        //edit page needs data from store only on first time component is rendered (after app's initial data has
        //succesfuly been loaded) to get current book's data and populate form's fields with initial data. 
        //When user submits the form, there is no any state update that would be needed to be selected back for display 
        //as the book's state is equal with form data that was dispatched to store after submitting the form, the form
        //still snows input user made, thus bsing userSelector(getBookId) would cause unnecesary re-render 
        const initialData = getBookById(store.getState(), bookIdIntVal);

        //Check if book with such id exists
        if (initialData === undefined) {
          setErrorMsg(`A book with id="${bookId}" was not found!`);
        } else {
          setFormInitialData(initialData);
        }
      }
    }

  }, [fetchingStatus]);

  useEffect(() => {
    //setting page title after first render
    setPageTitleTagValue("Edit book");
  }, []);
  
  let  formFieldsDefinition = [
    {label: "id", name:"id", type:"hidden"},
    {label: "Title", name:"title", type:"text", rule:"required"},
    {label: "Author", name:"author", type:"text", rule:"required"}, 
    {label: "Preface", name:"preface", type:"textarea"}];
    
  function saveSubmittedData(bookData){
    //part of loading indicator
    setSubmitingIndicator(true);

    store.dispatch(bookUpdated(bookData));
    
    //simulation of end of fetching, not using real submiting data to server
    setTimeout( () => {setSubmitingIndicator(false)}, 500); 
  }

  let parentListUrl = getQueryParamValue("parentListUrl");

  //link url for returning to list must point to list user came from to current edit page (all books list or 
  //favorites list), same is with redirecting after deleting a book from edit screen
  let backToListUrl = routes.bookListPath;
  if(parentListUrl){
    backToListUrl = parentListUrl;
  }

  //create current book delete url by adding delete parameter to book edit link.
  //if edit page was opened from other than all books list, parentListUrl get param is to be keeped in delete url
  //to redirect page to same list user opened editing page from in case user confirms or cancels deleting
  let deleteLinkUrl = routes.bookEditPath.replace(":bookId", bookId) + "?delete=true";
  if(parentListUrl){
    deleteLinkUrl += "&parentListUrl=" + parentListUrl;
  }

  //if user clicks on "Cancel" botton in delete confirmation dialog, page should redirect
  //to book editing url withoud delete get param, keeping parent list url param
  let deletionCancelActionUrl = routes.bookEditPath.replace(":bookId", bookId)
  if(parentListUrl){
    deletionCancelActionUrl += "?parentListUrl=" + parentListUrl;
  }

  //when deleting get param set and data for form is set, show confirmation dialog, otherwise, nothing to delete
  //when data is empty (first render or id of non existing book)
  let showDeletionConfirmationDialog = false;
  if(formInitialData && getQueryParamValue("delete") === "true"){
    showDeletionConfirmationDialog = true;
  }

  return  (
    <div className="book_editing">
      <div className="navigation">
        <Link to={backToListUrl}>Back</Link>
      </div>
      <div className="content_section">
        <h2>Edit book</h2>

        <div className="delete_book_link">
          <div className="action_button delete">
            <Link to={deleteLinkUrl}></Link>
          </div>
        </div>
        
        {showDeletionConfirmationDialog &&
          <BookDeletionConfirmationDialog booksIds={[bookId]} 
                                          afterDeletingRedirectUrl={backToListUrl} 
                                          cancelActionUrl={deletionCancelActionUrl}/>
        }

        {errorMsg &&
          <div className='error'>{errorMsg}</div>
        }

        {formInitialData && 
          <FormBuilder  formFieldsDefinition={formFieldsDefinition} 
                        submitButtonText="Update"
                        initialData={formInitialData} 
                        successfulSubmitCallback={saveSubmittedData}/>
        }

        {submitingIndicator&&
          <div className="load_indicator">saving...</div>
        }
      </div>
    </div>
  )
}




export default BookEditing;