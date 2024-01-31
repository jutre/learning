import React, { useState, useEffect } from 'react';


import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';


function Form() { 
    const [name, setName] = useState("");
    const [inputError, setInputError] = useState("");
  
    //in context external class instance is passed
    const extClass = useContext(LevelContext);
    
    console.log("<Form> in form_modular_context render()", extClass)
    
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
          <input type="text" value={name} 
                onChange={e => {setName(e.target.value);
                                //for testing context change
                                extClass.name = e.target.value;
                              }}/>
        </label>
        
        {inputError && 
            <strong> Error - {inputError}</strong>}
  
        <br/>
        
        <label><input type="submit" /></label>
          <br/>
          
      </form>
    )
  }

  export default Form;