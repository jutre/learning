import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import {
  bookSavingStatusResetToIdle,
  sendNewBookDataToServer,
  selectBookSavingStatus,
  selectLastSavedBookId,
  selectBookFullInfoById,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_REJECTED } from "../features/booksSlice";
import { 
  routes,
  bookCreatingFormFieldsDef  } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
//needed for action distching
import store from "../store/store";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";


function BookCreating() {
  const [createdBook, setCreatedBook] = useState(null);
  const [wasSubmitted, setWasSubmitted] = useState(false);
  //previous status info is used after submitting when saving execution status becomes "loading",
  //until then previous status info is not needed
  const [prevSendingToServerStatus, setPrevSendingToServerStatus] = useState(null);


  let sendingToServerStatus = useSelector(state => selectBookSavingStatus(state));
  let lastSavedBookId = useSelector(state => selectLastSavedBookId(state));
  //actually needed only after successful saving, but useSelector hook must be called directly in component.
  //The result is ignored until the moment book data has been saved
  let savedBookInfo = useSelector(state => selectBookFullInfoById(state, lastSavedBookId));
  
  const dispatch = useDispatch();

  useEffect(() => {
    //for resetting "bookSavingStatus" state from "rejected" to "idle". It is needed in situation if submitting new book
    //ended up with "rejected" status and user navigated to other page and then came back. 
    //At the moment when user comes back to book creation page the previously set "rejected" book saving status remains unchanged,
    //it must be set to "idle" on first component render 
    dispatch(bookSavingStatusResetToIdle());
    setPageTitleTagValue("Create new book");
  }, []);

  useEffect(() => {
    //after book was submitted, track sending status changes to make sure that had been "loading" and afte that
    //became "idle". It is needed to be sure that status had transferred from "loading" to "idle"
    //which means data saving function was in execution state, and came to success state. After such state transfer 
    //saved book info can display on page
    if(wasSubmitted){
      if(sendingToServerStatus === STATUS_LOADING){
        setPrevSendingToServerStatus(STATUS_LOADING);
      }else if(prevSendingToServerStatus === STATUS_LOADING){
        if(sendingToServerStatus === STATUS_IDLE){
          setCreatedBook(savedBookInfo);
          //reset prevSendingToServerStatus state varible and set wasSubmitted to false to be ready for submitting
          //another book in case use clicks "Add another book" link and submits next book data
          setPrevSendingToServerStatus(null);
          setWasSubmitted(false);

        }else if(sendingToServerStatus === STATUS_REJECTED){
          //when after loading state there is rejected state, reset prevSendingToServerStatus state varible and
          //set wasSubmitted to false to be ready for repetative submitting in case user tries to submit again
          setPrevSendingToServerStatus(null);
          setWasSubmitted(false);
        }
      }
    }
  }, [sendingToServerStatus]);

  let formDisabled = sendingToServerStatus === STATUS_LOADING;
    
  function saveSubmittedData(bookData){
    dispatch(sendNewBookDataToServer(bookData));
    //for tracking following data sending state changes
    setWasSubmitted(true);
  }


  /**
   * when book data is successfully saved component displays saved book data with link "Add another book". That link
   * url is equal with current page link and when link is clicked component is not re-rendered anyway because
   * react router has no condition to re-render and bring component to initial state when it displays book creation form
   * as it is when user navigates to book creation url from another url. The component is forced to get to state when
   * book creation form is displayed by setting createdBook state to null, all other state variable are already reset to 
   * initial state in hook that tracks readux book data saving function execution state
   */
  function handleAddNewBookLinkClick(){
    setCreatedBook(null);
  }

  
  let mainContent;
  if( ! createdBook){
    mainContent = 
      <FormBuilder  formFieldsDefinition={bookCreatingFormFieldsDef} 
                    successfulSubmitCallback={saveSubmittedData}
                    disableAllFields={formDisabled}/>;
  
  }else{
    let editUrl = routes.bookEditPath.replace(":bookId", createdBook.id)
    mainContent = (
      <>
        <div className="add_book_link">
          <Link to={routes.createBookPath}
                onClick={handleAddNewBookLinkClick}>Add another book</Link>
        </div>

        <div className="content_section">
          <div className="edit_book_link">
            
          </div>
          
          <div className="info_message">Book data was saved.</div>
          
          <div className="table">
            <div className="row">
              <div className="field_title">Title:</div>
              <div>{createdBook.title}</div>
            </div>
            <div className="row">
              <div className="field_title">Author:</div>
              <div>{createdBook.author}</div>
            </div>
            <div className="row">
              <div className="field_title">Preface:</div>
              <div>{createdBook.preface}</div>
            </div>
          </div>
          
          {/*link for editing just created book*/} 
          <div className="edit_book_link_wrapper">
              <Link to={editUrl}>
                <span>Edit saved book</span>
                <div className="action_button edit"></div>
              </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="create_book">
      <div className="navigation">
        <Link to={routes.bookListPath}>Back</Link>
      </div>
      
      <h2>Add book</h2>

      {/*if data sending has failed, display message*/}
      {sendingToServerStatus === STATUS_REJECTED &&
        <div className="loading_status_indicator">
          <div className="error">book saving has failed, try again later</div>
        </div>
      }
      
      {/*while data is being sent, show that data is loading*/}
      {sendingToServerStatus === STATUS_LOADING && 
        <div className="loading_status_indicator">saving...</div>
      }
      
      
      {mainContent}
    </div>
  )
}


export default BookCreating;