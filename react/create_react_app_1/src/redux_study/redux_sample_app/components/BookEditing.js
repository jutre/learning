import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookById } from "../selectors/books";
import { doUpdateBook } from "../actions/bookActions";
import { routes } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
//neede for selectors and action distching
import store from "../store/store";


/**
 * This component gets initial data from Redux store but does not use react-redux connect() because we don't need 
 * re-render component after store's state is updated because the new state corresponds to values is that is 
 * currently in input fields.
 */
function BookEditing() {
  const [submitingIndicator, setSubmitingIndicator] = useState(false);

  const { bookId } = useParams();
  const [formInitialData, setFormInitialData] = useState(() => {

    //data getting from store runs only once because function is passed to React state initialisation hook
    const initialData = getBookById(store.getState(), bookId);
    return initialData;
  });

  
  
  let  formFieldsDefinition = [
    {label: "id", name:"id", type:"hidden"},
    {label: "Title", name:"title", type:"text", rule:"required"}, 
    {label: "Description", name:"description", type:"textarea", rule:"required"}];
    
  function saveSubmittedData(bookData){
    //part of loading indicator
    setSubmitingIndicator(true);

    store.dispatch(doUpdateBook(bookData))
    
    //simulation of end of fetching, not using real submiting data to server
    setTimeout( () => {setSubmitingIndicator(false)}, 500); 
  }


  return  (
    <div>
      <div className="navigation">
        <Link to={routes.bookListPath}>Back</Link>
      </div>
      
      <h2>Edit book</h2>
      
      <FormBuilder  formFieldsDefinition={formFieldsDefinition} 
                    submitButtonText="Update"
                    initialData={formInitialData} 
                    successfulSubmitCallback={saveSubmittedData}/>

      {submitingIndicator&&
        <div className="load_indicator">saving...</div>}
    </div>
  )
}




export default BookEditing;