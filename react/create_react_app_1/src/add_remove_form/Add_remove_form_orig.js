import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";

const App = () => {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");
  const [itemList, setItemList] = useState([]);///

  useEffect(() => {
    extClass.setInputErrorFunc = setInputError
    extClass.setNameFunc=setName
    extClass.setItemListFunc=setItemList
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    extClass.processFormSubmit(itemList, name)
    
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input type="text" value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        /> {
        }input errro "{inputError}"
      </label>

      <div>entered - "{name}"</div>

      <label><input type="submit" /></label>

      <div>
        {itemList.map((item, index) => (
          <div key={index}>{index} - {item}
            <span 
              onClick={() => {
                extClass.deleteElement(itemList, index)
              }}> [delete this]</span> 
          </div>
        ))}
      </div>

    </form>
  )
}

export default App;