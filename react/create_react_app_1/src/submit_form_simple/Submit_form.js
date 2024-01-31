import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";


const App = () => {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setInputError("")
    if(name){
        setShowForm(false) 
        //display, can send data to server
    }else{
      setInputError("name must be not empty")
      setShowForm(true)
    }
  }

  var form = 
    <form onSubmit={handleSubmit}>
      Enter your name:
        <input type="text" value={name}
          onChange={e => setName(e.target.value)}/>
      
      {inputError && <strong> Error - {inputError}</strong>}
      
      <br/>
      <input type="submit" />
    </form>

  if(showForm){
    return form
  }else{
    return <div>Thank you <strong>{name}</strong>, data is submitted!</div>
  }
}

export default App;