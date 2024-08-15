import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { bookDeleted } from "../features/booksSlice";
import { getBookById } from "../features/booksSlice";
import { ModalDialog } from "./ModalDialog";

/**
 * displays deletion confirmation modal dialog with deletable book title, dialog has two options: confirm deleting and cancel.
 * If user confirms deleting, peforms book deleting from redux store and user is redirected to booklist url (book list url is taken 
 * from config.js file). Is user cancels deleting, page url is set to a value suplied in a "cancelActionUrl" argument.
 * Component also checks if a book with supplied exists in store, if not, returns error message
 * @param {int} bookId - a book id to be deleted
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
export function BookDeletionConfirmationDialog({ bookId, afterDeletingRedirectUrl, cancelActionUrl }) {
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  /**
   * deletes book in redux store and redirects to book list url.
   * Intended to call from modal confirmation dialog on "Confirm" button
   */
  function deleteBook(bookId) {
    dispatch(bookDeleted(bookId));
    navigate(afterDeletingRedirectUrl);
  }

  /**
   * redirects to book list page without params that way no book is selected
   * for deletion
   */
  function cancelSelectionForDeleting() {
    navigate(cancelActionUrl);
  }


  let bookInfo = useSelector(state => getBookById(state, bookId));
  ///Check if book for deletion exists, user might open current url from browser history 
  //when he deleted book previously
  if (bookInfo) {
    //show modal with the question whether user wants to delete selected book
    let modalDialogMessageStr = `Are you sure you want to delete "${bookInfo.title}"?`;

    return <ModalDialog content={modalDialogMessageStr}
      confirmFunction={() => deleteBook(bookId)}
      cancelFunction={cancelSelectionForDeleting} />;

    //a book with such id is not found
  } else {
    return <div className='error'>A book with id="{bookId}" was not found!</div>;
  }
}
