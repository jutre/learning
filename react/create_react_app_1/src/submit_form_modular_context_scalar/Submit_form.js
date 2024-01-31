import React, { useState } from 'react';
import { useRef } from "react";
import { LevelContext } from './LevelContext.js';
 
import UsesScalarValueFromContext from "./UsesScalarValueFromContext";


function getDateStr(){
  let date = new Date();
  let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
  return dateStr;
}



const App = () => {

  let ref = useRef(null);
  if (ref.current === null) {
    ref.current  = "ref initial val"
    console.log("<App> from modular_context/Submit_form.js creating ref (happens only once) ");
  }


  const [clicked, setClicked] = useState("was NOT clicked");

  console.log("<App> from modular_context/Submit_form.js renders, clicked = " + ref.current );


  let refToDiv = useRef(null);

    return (
      <div >
        <h1>testing context, value is sclar</h1> 

        <div onClick={() => {ref.current = "was clicked";}}>
          "click this text to change ref.current value which is passed as context value"<br/><br/>
        </div>
        {/* when ref values is changed onClick, ref value is changed, but child component does not render
         that value - ref value change does not trigger re-render. We need add state to current component, 
         change it's value to force re-rendering of current component, which is done further */} 

         {/*this is to check that ref value was changed by event handler */}
        <div onClick={() => {console.log("<App> from modular_context/Submit_form.js ref.current = " + ref.current )}}>
          "click this text to log current ref.current value to console"<br/><br/>
        </div> 

        <div onClick={() => {setClicked("click time " + getDateStr());}}>
          click this text to change components state and re-render component"<br/><br/>
        </div> 
        
        value passed to context - {ref.current}
        <br/>
        state var value - [{clicked}]
        <br/>  
        <LevelContext.Provider value={ref.current}>
          <UsesScalarValueFromContext/>
        </LevelContext.Provider>

        <hr/>
        <div ref={refToDiv} 
        onClick={() => {
                refToDiv.current.innerHTML = "changed using ref from useRef() at " + getDateStr() + " cl state val " + clicked}}>
          This div has ref to it's dom {clicked}
        </div>
      </div>
      )
  
}


export default App;