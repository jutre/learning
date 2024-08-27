/**
 * 
 * @param {string} content - string that will be displayed in modal box as a question
 * @param {function} confirmFunction - function that will be executed when use pressed "Yes" button
 * @param {function} cancelFunction - - function that will be executed when use pressed "No" button
 * @param {jsx} contentJsx - jsx, this prop may be passed as direct jsx or as a React component
 * return value, passed to component like <ModalDialog {...other props} contentDisplayComponent={<SomeComponent/?} />.
 * The value of this prop will be passed displayed under "content" prop output. the contentDisplayComponent prop is usefull
 * when it is needed to conditionally display information from a Redux store, like title of an object for deletion. It is
 * not possible to conditionally call react-redux.useSelector function, but we need it only when user selects deletion, not all 
 * the time. For this case it is convenient to create a component that fetches data from redux and returns value as jsx and
 * the modal dialog will display the information of the object of modal dialog question for example the title of item to be deleted
 * @returns 
 */
export function ModalDialog({ content, confirmFunction, cancelFunction, contentJsx = null }) {


  /**
   * removes "overflow:hidden" style from body tag. Used in every action on dialog to remove
   * previously added style to restore scrollbar showing abiblity on body
   */
  function removeOverflowStylingFromBodyTag() {
    document.body.style.overflow = 'auto';
  }

  const _confirm = () => {
    removeOverflowStylingFromBodyTag();
    confirmFunction();
  };

  const _cancel = () => {
    removeOverflowStylingFromBodyTag();
    cancelFunction();
  };

  //set style to body tag to hide scrollbar on modal view
  document.body.style.overflow = 'hidden';

  return (
    <>
      <div className='overlay_for_modal_dialog' onClick={() => { _cancel(); }}></div>
      <div className='modal_dialog'>
        <div className='container'>
          <div className='body'>
            <div className='content'>
              <div>{content}</div>
              {contentJsx &&
                <div>{contentJsx}</div>
              }
            </div>
            <div className='options'>
              <button className='button_confirm' onClick={() => { _confirm(); }}>Yes</button>
              <span className='button_cancel' onClick={() => { _cancel(); }}>No</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
