/**
 * This function it intended to be used as a part of "click" event handler attached to attached to window.document. The other part of it
 * must be defined inside React compoent's function using useCallback() hook and invoke current function from it. The function defined
 * in component is an actual event handler attached to window.document, the current function does all the logic.
 * The function checks if click was outside of info div's body and closes the info div in such case.
 * 
 * @param {click Event from the DOM} event - the event argument received by the React's click event handler function 
 * @param {ref to element} beginningOfMenuRef - reference created by React's useRef() hook to a beginning element of
 * info div (contains info div toggler and body) to track the boundaries of info div and to find out whether the click
 * was been done outside of info div anywhere in window.document
 * @param {ref to element} documentRef - reference created by React's useRef() hook to window.document which will be used to remove 
 * click event handler when it the click was outside of menu (for performance issues don't use directly document.removeEventListener())
 * @param {function} docClickEventHandlerIdentifier - reference to the function (the identifier or it) that is defined in React's component  
 * and attached to window.document. The reference is used to remove component's defined function from window.document event listeners
 * @param {*} callback - reference to the function that is defined in React's component and which performs needed state changes
 * or other needed actions in component
 * @returns void
 */
export function closeDivOnClickOutsideOfDiv(event, beginningOfMenuRef, documentRef, docClickEventHandlerIdentifier, callback) {
  
  let eventPropogationPathElement = event.target;
  while (eventPropogationPathElement) {
    //traverse elements starting from clicked element to every next ancestor.
    //If menu beginning element is found, don't do anytning as we have clicked inside of menu
    if (eventPropogationPathElement === beginningOfMenuRef.current) {
      return;
    }
    eventPropogationPathElement = eventPropogationPathElement.parentNode;
  }

  //we have clicked outside of menu, set menu opened state to false and remove event handler
  callback();
  documentRef.current.removeEventListener('click', docClickEventHandlerIdentifier);
}

/**
 * searches in array of objects those whose 'title' property contains search phrase.
 * Returns array with those objects that matched the search, if none found, returns empty
 * array
 * @param {array[object]} booksArr array of objects which contains property 'title'
 * @param {string} filterText
 * @returns {array[object]}
 */
export function searchBooks(booksArr, filterText) {

  filterText = filterText.trim();
  //don't perfoms searching if search text less than three symbols
  if (filterText.length < 3) {
    return [];
  }

  let searchResult = [];
  booksArr.forEach((book) => {
    if (book.title.toLowerCase().indexOf(filterText.toLowerCase()) !== -1) {
      searchResult.push(book);
    }
  });

  return searchResult;
}

