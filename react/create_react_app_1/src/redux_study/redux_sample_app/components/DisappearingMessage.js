import { useState, useEffect } from "react";

/**
 * Component that intended to be used for animating some message gradual hiding after it has been displayed. Intended to be 
 * used to show message that some event has completed like some data saved or deleted and after that hiding that message.
 * It is achieved by letting create css transitions when html element styling changes by adding addition html class to element.
 * Div is rendered for first time with certain html class, and imidiatelly after that re-rendered for second time with 
 * additional class added. 
 * 
 * @returns 
 */
function DisappearingMessage({messageText}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    //class transitions are not animated by css transitions without some delay between first and second
    //render
    let timer = setTimeout(() => {
      setHidden(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);
  
  let divClassName = "disappearing_message" + (hidden ? " hidden": "");
  return (
    <div className={divClassName}>
      <div className="text">
        {messageText}
      </div>
    </div>)
  
}

export default DisappearingMessage;
