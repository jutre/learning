
//
//1. test - tests if changes in context value, which is object, makes rerender current context consumer.
//Changes is made in objec's property value, property value is not used in current component
//

import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

function getDateStr(){
  let date = new Date();
  let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
  return dateStr;
}

function UsesValueFromContext() {
  
    //in context external class instance is passed
    let contextValue = useContext(LevelContext);
    
    //logs on render
    console.log("<UsesValueFromContext> form_modular_context  render(), context value = " + contextValue);

    return ( 
      <div>
        <p></p>
          &lt;UsesValueFromContext&gt; component, context value= {contextValue}, {getDateStr()}     
      </div>
    )
  }

  export default UsesValueFromContext;