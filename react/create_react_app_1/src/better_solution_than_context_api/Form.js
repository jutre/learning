import { useState, useEffect } from "react";

/*import class instance that will have access to current component's 
  setState() functions instead of importing context (we won't use context at all)*/
import { logicProcessor } from "./LogicProcessor";

function Form() {

  /*instead of using context like 
        "const valueFromContext = React.useContext(MyDefinedContext);"
    1) introduce state variable for re-rendering
    2) pass component's dispatchSetState function to imported class which calls it to set value

    Through importing same "logicProcessor" class instance in any other component everywhere in 
    components tree current component's state can be changed through that class methods*/
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");
  
  useEffect(() => {
    //  !!!here we pass reference of setState() function to imported class instance
    logicProcessor.setInputErrorListener(setInputError);
    logicProcessor.setNameListener(setName);
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    logicProcessor.processFormSubmit(name);
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
export default Form;