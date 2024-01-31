import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";


const App = () => {

  return(
    <div>
      <Form/>
      Items list
      <ListDisplayer/>
    </div>
  )
}
function Form() {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");
  
  useEffect(() => {
    extClass.setInputErrorFunc = setInputError;
    extClass.setNameFunc = setName;
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    extClass.processFormSubmit(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      New list item: 
      <input  value={name}
              onChange={e => setName(e.target.value)}/> 

      <input type="submit" value="Add item"/>

      {inputError && <strong> Error - {inputError}</strong>}
    </form>
  )
}


function ListDisplayer(){
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    extClass.setItemListFunc=setItemList
  }, []);

  return(
    <div>
        {itemList.map((item, index) => (
          <div key={index}>{item}
            <span onClick={() => {extClass.deleteElement(item)}}> 
              [delete this]</span> 
          </div>
        ))}
      </div>
  )
}

export default App;