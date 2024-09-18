import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQueryParamValue } from "../utils/utils";
import {
  bookUpdated,
  getBookById,
  selectInitialDataFetchingStatus,
  bookUpdatingStatusResetToIdle,
  sendUpdatedBookDataToServer,
  selectBookUpdatingStatus,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_REJECTED } from "../features/booksSlice";
import { useSelector, useDispatch } from 'react-redux';
import {
  routes,
  bookEditFormFieldsDef } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
import DisappearingMessage from './DisappearingMessage';
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";
import { BookDeletionConfirmationDialog } from "./BookDeletionConfirmationDialog";


/**
 * This component gets initial data from Redux store but does not use react-redux connect() because we don't need 
 * re-render component after store's state is updated because the new state corresponds to values is that is 
 * currently in input fields.
 */
function BookEditing() {
  const [displaySavingSuccessMsg, setDisplaySavingSuccessMsg] = useState(false);
  
  //keep form initial data in compnent's state as on first render page might be opened directly using page link and at
  //that moment initial application data has not been loaded yet and there is nothing to display. When data loading finishes
  //loading, editable book data will be set to this array and component will render the form
  const [formInitialData, setFormInitialData] = useState();
  //will contain possible errors
  const [errorMsg, setErrorMsg] = useState();

  const [wasSubmitted, setWasSubmitted] = useState(false);
  //previous status info is used after submitting when saving execution status becomes "loading",
  //until then previous status info is not needed
  const [prevBookUpdatingStatus, setPrevBookUpdatingStatus] = useState(null);

  const dispatch = useDispatch();


  useEffect(() => {
    //for resetting "bookUpdatingStatus" state from "rejected" to "idle". It is needed in situation if submitting updated book
    //data has ended up with "rejected" status and user navigated to other page and then came back. 
    //At the moment when user comes back to book updating page the previously set "rejected" book saving status remains unchanged,
    //it must be set to "idle" on first component render 
    dispatch(bookUpdatingStatusResetToIdle());
    //setting page title after first render
    setPageTitleTagValue("Edit book");
  }, []);

  let initialDataFetchingStatus = useSelector(state => selectInitialDataFetchingStatus(state));

  const { bookId } = useParams();
  let bookIdIntVal = parseInt(bookId);
  //useSelector hook must be called directly in component, thats why it is called here. The actual book data might
  //not be set yet because of initial fetching or path variable might be invalid. In either cases result is ignored
  //until initial data is fetched 
  let bookData = useSelector(state => getBookById(state, bookIdIntVal));


  //this hook is used to populate form's fields with initial data. It's dependancy if book's state fetching status, 
  //the actual data selection from store is done when fetching status becomes "idle". Such dependency is created
  //for case when application is initially opened using url corresponding to book editing page, like "/1/edit/"
  //which means that initial data has not been loaded before, the initial data loading might still be in progress,
  //the book data is selected from store only at moment when fetching status is "idle". If data loading state 
  //is in "loading" or "rejected" state, current page does not show form, the loading status is displayed in other
  //component
  useEffect(() => {
    //check if bookId segment is positive integer
    if (! /^[1-9][0-9]*$/.test(bookId)) {
      setErrorMsg(bookId + " - invalid parameter value! Value must be integer greater than zero.");

    } else {
      if(initialDataFetchingStatus === STATUS_IDLE){
        
        
        //here a Redux state in store is accessed directly instead of using useSelector. The reason for that is that 
        //edit page needs data from store only on first time component is rendered (after app's initial data has
        //succesfuly been loaded) to get current book's data and populate form's fields with initial data. 
        //When user submits the form, there is no any state update that would be needed to be selected back for display 
        //as the book's state is equal with form data that was dispatched to store after submitting the form, the form
        //still snows input user made, thus bsing userSelector(getBookId) would cause unnecesary re-render 
        //const initialData = getBookById(store.getState(), bookIdIntVal);
        //Check if book with such id exists
        if (bookData === undefined) {
          setErrorMsg(`A book with id="${bookId}" was not found!`);
        } else {
          setFormInitialData(bookData);
        }
      }
    }

  }, [initialDataFetchingStatus]);


  let bookUpdatingStatus = useSelector(state => selectBookUpdatingStatus (state));
  
  useEffect(() => {
    //after book was submitted, track sending status changes to make sure that had been "loading" and afte that
    //became "idle". It is needed to be sure that status had transferred from "loading" to "idle"
    //which means data saving function was in execution state, and came to success state. After such state transfer 
    //saved book info can display on page
    if(wasSubmitted){
      if(bookUpdatingStatus === STATUS_LOADING){
        setPrevBookUpdatingStatus(STATUS_LOADING);
      }else if(prevBookUpdatingStatus === STATUS_LOADING){
        if(bookUpdatingStatus === STATUS_IDLE){
          setDisplaySavingSuccessMsg(true);
          //reset prevBookUpdatingStatus state varible and set wasSubmitted to false to be ready for submitting
          //updated book data another time as form stays visible
          setPrevBookUpdatingStatus(null);
          setWasSubmitted(false);

        }else if(bookUpdatingStatus === STATUS_REJECTED){
          //when after loading state there is rejected state, reset prevBookUpdatingStatus state varible and
          //set wasSubmitted to false to be ready for repetative submitting in case user tries to submit again
          setPrevBookUpdatingStatus(null);
          setWasSubmitted(false);
        }
      }
    }
  }, [bookUpdatingStatus]);
  
  let formDisabled = bookUpdatingStatus === STATUS_LOADING;

  let  formFieldsDefinition = bookEditFormFieldsDef;
    
  function saveSubmittedData(bookData){
    setDisplaySavingSuccessMsg(false);
    dispatch(sendUpdatedBookDataToServer(bookData));
    //for tracking following data sending state changes
    setWasSubmitted(true);
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
  //when data is empty ( in case of initial data loading  or id of non existing book)
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

        {/*if data sending has failed, display message*/}
        {bookUpdatingStatus === STATUS_REJECTED &&
          <div className="loading_status_indicator">
            <div className="error">book updating has failed, try again later</div>
          </div>
        }
        
        {/*while data is being sent, show that data is loading*/}
        {bookUpdatingStatus === STATUS_LOADING && 
          <div className="loading_status_indicator">updating...</div>
        }

        {displaySavingSuccessMsg && 
          <DisappearingMessage messageText="Saved!"/>
        }

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
                        initialData={bookData} 
                        successfulSubmitCallback={saveSubmittedData}
                        disableAllFields={formDisabled}/>
        }

      </div>
    </div>
  )
}




export default BookEditing;