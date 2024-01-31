import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";


const App = () => {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");
  


  useEffect(() => {
    extClass.setInputErrorFunc = setInputError
    extClass.setShowFormFunc=setShowForm
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    extClass.processFormSubmit(name)
  }

  var form = 
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input type="text" value={name}
          onChange={e => setName(e.target.value)}/>
      </label>
      
      {inputError && <strong> Error - {inputError}</strong>}

      <br/>
      
      <label><input type="submit" /></label>

    </form>


  if(showForm){
    return form
  }else{
    return <div>Thank you <strong>{name}</strong>, data is submitted!</div>
  }
}

export default App;