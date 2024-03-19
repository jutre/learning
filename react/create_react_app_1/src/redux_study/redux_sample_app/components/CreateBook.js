import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookCreated } from "../features/booksSlice";
import { routes } from "../config";
import { FormBuilder } from '../utils/FormBuilder';
//needed for action distching
import store from "../store/store";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";


function CreateBook() {
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    setPageTitleTagValue("Create new book");
  }, []);

  let  formFieldsDefinition = [
    {label: "Title", name:"title", type:"text", rule:"required"}, 
    {label: "Description", name:"description", type:"textarea", rule:"required"}];
    
  function saveSubmittedData(bookData){
    store.dispatch(bookCreated(bookData));
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