import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { multipleBooksDeleted, getBookById } from "../features/booksSlice";
import { ModalDialog } from "./ModalDialog";

/**
 * displays deletion confirmation modal dialog before deleting one or multiple books. In one book is to be deleted, dialog displays
 * confirmation question about deleting a single book while also displaying deletable book title. If multiple books are selected 
 * for deleting confirmation question displays amount of deleteable books. Dialog has two options: confirm deleting and cancel.
 * If user confirms deleting, book deleting from redux store is performem and user is redirected to url speficied in components
 * "afterDeletingRedirectUrl" property). Is user cancels deleting, page url is set to a value speficied in a "cancelActionUrl" prop.
 * In case of deleting one book, the existance of book is checked in store, if book does not exist returns error message. In case of 
 * deleting multiple books, book existance is not checked, not any error messages are displayed, the reducer deleting books
 * is invoked
 * @param {int} booksIds - a book id to be deleted
 * @param {string} afterDeletingRedirectUrl - when book is deleted page tipically will be redirected to book list url, but in some cases
 * additional params might be needed to be keeped also after deleting like search params
 * @param {string} cancelActionUrl - an url to which page should be redirected if user chooses "cancel" action in dialog. Current 
 * component is used in items list and edit pages, both pages have different url and form of get parameter that initiates delete confirmation
 * dialog, for list param would be in form "deleteId=1", edit screen "delete=true", there is no pattern that delete param would be identified 
 * to be removed from deletion initiation url, for that reason an url where to redirect after user cancellation of deletion must be defined
 * in page and passed to deletion dialog as property
 *
 * @returns {jsx} markup that shapes html for confirmation dialog or error message
 */
export function BookDeletionConfirmationDialog({ booksIds, afterDeletingRedirectUrl, cancelActionUrl }) {
  console.log('BookDeletionConfirmationDialog' , cancelActionUrl);
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  /**
   * deletes book in redux store and redirects to book list url.
   * Intended to call from modal confirmation dialog on "Confirm" button
   */
  function deleteBooks(booksIds) {
    // As current app was made to get training both with redux and react-router, multiple slices were creates as a result responding
    // to actions from other slices were used. When deleting multiple books selected were introduced, it is clear that information
    //that resides in redux state in one slice is carried around to another slice's reducer using url get parameters - infrormation
    //from selected books slice is added to get parameter and passed as action.paylod to another slice's reducer. It is ok for
    //current case when url's are used to pass other information for various app actions (editable item id, single item delete id)
    //as the aim of app was to exercise in using react-router. If routing would not be used than seleced items information should be
    //be placed in books slice as in case of multiple books deleting reducer selected items information would be taken from state 
    //directly 
    dispatch(multipleBooksDeleted(booksIds));
    navigate(afterDeletingRedirectUrl);
  }

  /**
   * redirects to book list page without params that way no book is selected
   * for deletion
   */
  function cancelSelectionForDeleting() {
    navigate(cancelActionUrl);
  }

  let modalDialogMessageStr
  let errorMessage;
  //it is necessary to get book title in case of deleting single book to display title in confirmation dialog.
  //The information about first book in deletable array list if always seleced, but ignored in case of deleting multiple books as
  //it is impossible to conditionally invoke useSelector hook
  let bookInfo = useSelector(state => getBookById(state, booksIds[0]));
  
  if(booksIds.length === 1){console.log('booksIds.length === 1', booksIds);
    //in case of deleting single book, display confirmation dialog with question if user wants to delete a selected book which
    //contains deletable book title
    if (bookInfo) {
      modalDialogMessageStr = `Are you sure you want to delete "${bookInfo.title}"?`;

      //a book with such id is not found, display error 
    } else {
      errorMessage = `A book with id="${booksIds[0]}" was not found!`;
    }
  
  }else{
    //in case of deleting multiple books, display confirmation dialog with question which contains the number of deletable books.
    //Book existance according to booksIds array element value are not checked, non existing books are ignored
    modalDialogMessageStr = `Are you sure you want to delete ${booksIds.length} books?`;
  }

  if(errorMessage){
    return <div className='error'>{errorMessage}</div>
  }else{

    return <ModalDialog content={modalDialogMessageStr}
                        confirmFunction={() => deleteBooks(booksIds)}
                        cancelFunction={cancelSelectionForDeleting} />
  }
}
