import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getQueryParamValue } from "../utils/utils";
//import { getBookById } from "../selectors/books";
import { bookUpdated,getBookById } from "../features/booksSlice";
import { routes } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
//neede for selectors and action distching
import store from "../store/store";
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

  const { bookId } = useParams();

  //set formInitialData state variable to the value of editable book
  useEffect(() => {
    //check if bookId segment is positive integer
    if (! /^[1-9][0-9]*$/.test(bookId)) {
      setErrorMsg(bookId + " - invalid parameter value! Value must be integer greater than zero.");

    } else {
      let bookIdIntVal = parseInt(bookId);
      //Check if book with such id exists
      //here a Redux store is accessed directly instead of using useSelector. We need data from store only on first time
      //component is rendered to get current book's data and fill the form with it. When user submit the form, the form is
      //still snown will input user made, the input is saved to Redux store, but rerender is not needed. This component has 
      //also a submitting indicator, indicator causes rerendering of component twice ofter submit, on every rerender userSelector
      //will be invoked. Additionally useSelector will be invoked also after actual store's state update after form submit - four useEffect 
      //invocations after a form submit. When accessing store directly, selector that gets book's data only once is invoked once
      const initialData = getBookById(store.getState(), bookIdIntVal);

      if (initialData === undefined) {
        setErrorMsg(`A book with id="${bookId}" was not found!`);
      } else {
        setFormInitialData(initialData);
      }
    }

    //setting page title from here
    setPageTitleTagValue("Edit book");
  }, []);
  
  let  formFieldsDefinition = [
    {label: "id", name:"id", type:"hidden"},
    {label: "Title", name:"title", type:"text", rule:"required"}, 
    {label: "Description", name:"description", type:"textarea", rule:"required"}];
    
  function saveSubmittedData(bookData){
    //part of loading indicator
    setSubmitingIndicator(true);

    store.dispatch(bookUpdated(bookData));
    
    //simulation of end of fetching, not using real submiting data to server
    setTimeout( () => {setSubmitingIndicator(false)}, 500); 
  }

  //create book delete url by adding delete parameter to book edit link.
  let deleteUrl = routes.bookEditPath.replace(":bookId", bookId) + "?delete=true";

  //if user clicks on "Cancel" botton in delete confirmation dialog, page should redirect
  //to book editing url withoud any params
  let deletionCancelActionUrl = routes.bookEditPath.replace(":bookId", bookId)

  //when deleting get param set and data for form is set, show confirmation dialog, otherwise, nothing to delete
  //when data is empty (first render or id of non existing book)
  let showDeletionConfirmationDialog = false;
  let afterDeletingRedirectUrl = routes.bookListPath;
  if(formInitialData && getQueryParamValue("delete") === "true"){
    showDeletionConfirmationDialog = true;
  }

  return  (
    <div className="book_editing">
      <div className="navigation">
        <Link to={routes.bookListPath}>Back</Link>
      </div>
      <div className="content_section">
        <h2>Edit book</h2>

        <div className="delete_book_link">
          <div className="action_button delete">
            <Link to={deleteUrl}></Link>
          </div>
        </div>
        
        {showDeletionConfirmationDialog &&
          <BookDeletionConfirmationDialog booksIds={[bookId]} 
                                          afterDeletingRedirectUrl={afterDeletingRedirectUrl} 
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