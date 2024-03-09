import { useState } from "react";
import { Link } from "react-router-dom";
import { doCreateBook } from "../actions/bookActions";
import { routes } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
//needed for action distching
import store from "../store/store";


function CreateBook() {
  const [showForm, setShowForm] = useState(true);


  let  formFieldsDefinition = [
    {label: "Title", name:"title", type:"text", rule:"required"}, 
    {label: "Description", name:"description", type:"textarea", rule:"required"}];
    
  function saveSubmittedData(bookData){
    store.dispatch(doCreateBook(bookData));
    setShowForm(false);
  }

  let mainContent;
  if(showForm){
    mainContent = 
      <FormBuilder  formFieldsDefinition={formFieldsDefinition} 
                    successfulSubmitCallback={saveSubmittedData}/>;
  }else{
    mainContent = (
      <>
        <div className="info_message">Book data was saved.</div>
        <div className="navigation"><Link to={routes.bookListPath}>Return to book list</Link></div>
      </>
    );
  }

  return  (
    <div className="create_book">
      <div className="navigation">
        <Link to={routes.bookListPath}>Back</Link>
      </div>
      
      <h2>Add book</h2>
      {mainContent}
    </div>
  )
}


export default CreateBook;