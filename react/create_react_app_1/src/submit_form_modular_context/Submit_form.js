import React, { useState, useEffect } from 'react';
import { useRef } from "react";

import Form from "./Form";
import External from "./External";
import { LevelContext } from './LevelContext.js';
 
import UsesValueFromContext from "./UsesValueFromContext";


function getDateStr(){
  let date = new Date();
  let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
  return dateStr;
}

const App = () => {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [clicked, setClicked] = useState("no");

  

  let ref = useRef(null);
  if (ref.current === null) {
    let extClass = new External ()
    extClass.setShowFormFunc=setShowForm
    extClass.setNameFunc=setName
    ref.current  = extClass
    console.log("<App> from modular_context/Submit_form.js creating ref (happens only once) ");
  }

  /*
  ////testing, if changing ref.current is detected by useEffect - yes.  In initial render ref is defined
  //and after first render it is changed by  useEffect( () => {}, []); and detected by useEffect( () => {}, [ref]); 
  useEffect(() => {
    const extClass = new External ()
    ref.current.setShowFormFunc=setShowForm
    ref.current.setNameFunc=setName

    ref.current  = extClass

    console.log("<App> from modular_context/Submit_form.js first and only useEffect() ");
  }, []);

  useEffect(() => { 
    console.log("<App> from modular_context/Submit_form.js modular ref changes - in useEffect[ref]", ref.current);
  }, [ref]);
  */

  //this way it is changed every render
  //ref.current.name = " modular_context/Submit_form.js excClass.name sett in render, " + getDateStr(); 
  console.log("<App> from modular_context/Submit_form.js renders, clicked = " + clicked);

  if(showForm){
    return (
      <div >
        <h1>testing context</h1> 
        <div onClick={() => {setClicked("yes");}}>"click this text to rerender containing component"</div> 
        clicked value - {clicked}
        <br/>
        <br/>  
        <LevelContext.Provider value={ref.current}>
          <Form/>
          <UsesValueFromContext/>
        </LevelContext.Provider>
      </div>
      )
  }else{
    return <div onClick={e => {console.log("ref click", ref.current);}}>Thank you <strong>{name}</strong>, data is submitted!</div>
  }
}


export default App;