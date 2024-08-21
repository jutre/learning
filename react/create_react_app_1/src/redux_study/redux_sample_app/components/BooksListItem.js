import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { routes } from "../config";
import { selectBookFullInfoById } from "../features/booksSlice";
import { bookFavoriteStateToggled } from "../features/favoriteBooksSlice"


export function BookListItem({bookId, deleteUrl}) {
  
  let book = useSelector(state => selectBookFullInfoById(state, bookId));
  //let isBookPresentInFavoritesList = useSelector(state => isBooksAddedToFavorites(state, bookId));
 
  //replace bookId segment in book edit route pattern
  let editUrl = routes.bookEditPath.replace(":bookId", bookId);
  

  const dispatch = useDispatch();

  function handleAddToFavoritesClick(){
    dispatch(bookFavoriteStateToggled(bookId));
  }
  console.log('render book list item,  ', bookId);
  let addToFavoritesDivClassName = "button ";
  if(book.isAddedToFavorites){
    addToFavoritesDivClassName += "is-added-to-favorites";
  }else{
    addToFavoritesDivClassName += "add-to-favorites";
  }
  return  (
    <div className="item">
      <div className="title">{book.title}</div>
      <div className="actions">
        <div className={addToFavoritesDivClassName} onClick={handleAddToFavoritesClick}></div>
        <div className="button edit"><Link to={editUrl}></Link></div>
        <div className="button delete"><Link to={deleteUrl}></Link></div>
      </div>
    </div>
  )
}