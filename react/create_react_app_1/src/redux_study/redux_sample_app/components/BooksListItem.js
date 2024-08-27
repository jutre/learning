import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { routes } from "../config";
import { selectBookFullInfoById } from "../features/booksSlice";
import { bookFavoriteStateToggled } from "../features/favoriteBooksSlice";
import { bookCollectionAddedToSelection, singleBookRemovedFromSelection } from "../features/uiControlsSlice";
//temp for debugging
import store from "../store/store";

export function BookListItem({bookId, deleteUrl}) {
  
  let book = useSelector(state => selectBookFullInfoById(state, bookId));
 
  //replace bookId segment in book edit route pattern
  let editUrl = routes.bookEditPath.replace(":bookId", bookId);
  

  const dispatch = useDispatch();

  /**
   * adds to deletable books selection if checkbox is checked next to the book is checked and removes
   * from selection if checbox is unchecked
   * @param {change event object} event 
   */
  function handleBookSelectionForDeleting(event){
    let isCheckboxChecked = event.target.checked;
    if(isCheckboxChecked){
      //to add a book to selection, action.payload value must be an array consisting of single element which value is bookId
      dispatch(bookCollectionAddedToSelection([bookId]));
    
    }else{
      //to remove a book from selection, action.payload value must be integer - bookId to be removed from selection
      dispatch(singleBookRemovedFromSelection(bookId));
    }
  }

  /**
   * when cliking on favourites icon, add or remove from favourites
   */
  function handleAddToFavoritesClick(){
    dispatch(bookFavoriteStateToggled(bookId));
  }

  
  //calculate favourites icon class depending on book presence in favourites
  let addToFavoritesDivClassName = "action_button ";
  if(book.isAddedToFavorites){
    addToFavoritesDivClassName += "is-added-to-favorites";
  }else{
    addToFavoritesDivClassName += "add-to-favorites";
  }

  //console.log('BooksListItem render, state', bookId, store.getState());
  return  (
    <div className="item">
      <div className="checkbox_wrapper">
        <label>
          <input  type="checkbox" 
                  checked={book.isSelectedForDeleting}
                  onChange={handleBookSelectionForDeleting}/>
          <div className="custom_checkbox"></div>
          </label>
      </div>
      <div className="title">{book.title}</div>
      <div className="actions">
        <div className={addToFavoritesDivClassName} onClick={handleAddToFavoritesClick}></div>
        <div className="action_button edit"><Link to={editUrl}></Link></div>
        <div className="action_button delete"><Link to={deleteUrl}></Link></div>
      </div>
    </div>
  )
}