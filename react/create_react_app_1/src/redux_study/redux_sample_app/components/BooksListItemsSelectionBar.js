/**
 * This component creaters markup that displays multiple select "checkbox like" control and a delete button. Checkbox control is used
 * to do batch selecting of list items - selects all items when none is selected or deselects all if any item is selected.
 * When there are any items selected, delete button becomes active - if user clicks on it, browser url is set to deletion url 
 */
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { routes } from "../config";
import {  bookCollectionAddedToSelection, 
          allBooksRemovedFromSelection, 
          selectIsAnyBookSelected,
          selectBooksInSelection } from "../features/uiControlsSlice";

function BooksListItemsSelectionBar({booksIds, searchGetParamVal}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let isAnyBookSelected = useSelector(state => selectIsAnyBookSelected(state));
  let selectedBooks = useSelector(state => selectBooksInSelection(state));

  /**
   * process logic when user click batch selection checkbox control. 
   */
  function handleBatchSelectorClick(){
    //if no any book is selected then multiple select checkbox adds all list items to selection state (and checkboxes 
    //are displayed for each book in component that displays book info)
    if(isAnyBookSelected){
      dispatch(allBooksRemovedFromSelection());

      //if at lesat one item in list is selected than multiple select checkbox removes all selected items from selection state
      //(and checkboxes are removed from all books)
    }else{
      dispatch(bookCollectionAddedToSelection(booksIds));
    }
  }
  

  /**
   * If there is any book selected then redirects to deletion url when user clicks on "Delete" button.
   * Creates delete parameter value by adding selected books ids to it. 
   * If list is filtered by searching string, adds search get parameter to url
   */
  function handleRedirectToDeletionUrl(){
    let deleteUrl;
    if(isAnyBookSelected){
      deleteUrl = routes.bookListPath + "?deleteId="+ selectedBooks.join(",");
      if(searchGetParamVal){
        deleteUrl += "&search=" + searchGetParamVal; 
      }
      navigate(deleteUrl);
    }
  }
  

  let batchSelectorClassName = "batch_select_control custom_checkbox";
  let batchSelectorModeTitle;
  let deleteButtonClassName = "action_button delete";

  if(isAnyBookSelected){
    batchSelectorModeTitle = "unselect all items";
    batchSelectorClassName += " all_items_deselector"; 

  }else{
    batchSelectorModeTitle = "select all items";
    batchSelectorClassName += " all_items_selector" ;
    //no any book is selected, make deletion button visually inactive
    deleteButtonClassName += " disabled";
  }

  return  (
    <div className="book_list_selection_bar">
      <div className="checkbox_wrapper">
        <div  onClick={handleBatchSelectorClick}
              className={batchSelectorClassName}
              title={batchSelectorModeTitle}>
        </div>
      </div>
      
      <div  className={deleteButtonClassName}
            onClick={handleRedirectToDeletionUrl}>
      </div>

    </div>
  )
}


export default BooksListItemsSelectionBar;