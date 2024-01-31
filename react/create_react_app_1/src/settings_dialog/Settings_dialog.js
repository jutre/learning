// demonstration when use clicks on button "Change settings" and a div with form is shown, the div contains a "Close button" for hiding the dialog

import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";


const App = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    extClass.setShowDialogFunc = setShowDialog
  }, []);

  return(
    <div>
      <button onClick={() => {extClass.showDialog()}}>
          {/* onClick={() => {setShowDialog(true)}} //old way */}
        Change settings
      </button>

      <ListDisplayer/>

      {showDialog && 
        <div className='dialog'>
          <span onClick={() => {extClass.hideDialog()}} className='close-button'>X close form</span>
            {/* onClick={() => {setShowDialog(false)}} //old way */}
          <Form/>
        </div>
      }
    </div>
  )
}

function Form() {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");
  

  useEffect(() => {
    extClass.setInputErrorFunc = setInputError
    extClass.setNameFunc=setName
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    extClass.processFormSubmit(name)
  }

  return (
    <form onSubmit={handleSubmit}>

      <label>Enter your name:
        <input  type="text" value={name}
                onChange={e => setName(e.target.value)}
        /> 
        {inputError && <strong> Error - {inputError}</strong>}
      </label>
                
      <br/>
      <label>
        <input type="submit" />
      </label>

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
            <span onClick={() => {extClass.deleteElement(index)}}
                  style={{cursor:'pointer'}}
            > [delete this]</span> 
          </div>
        ))}
      </div>
  )
}

export default App;