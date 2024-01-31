import React, { useState, useEffect } from 'react';
import { external as extClass } from "./External";


function Form() { 
    const [name, setName] = useState("");
    const [inputError, setInputError] = useState("");
  
  
    useEffect(() => {
      extClass.setInputErrorFunc = setInputError
    }, []);
  
  
    const handleSubmit = (event) => {
      event.preventDefault();
      extClass.processFormSubmit(name)
    }
    
    return ( 
      <form onSubmit={handleSubmit}>
        <label>Enter your name:
          <input type="text" value={name} onChange={e => setName(e.target.value)}/>
        </label>
        
        {inputError && 
            <strong> Error - {inputError}</strong>}
  
        <br/>
        
        <label><input type="submit" /></label>
  
      </form>
    )
  }

  export default Form;