import { useState, useEffect } from 'react';


/*import class instance that will have access to current component's 
  setState() functions instead of importing context (we won't use context at all)*/
import { logicProcessor } from "./LogicProcessor";


function ItemsList() {
  /*instead of using context like 
        "const valueFromContext = React.useContext(MyDefinedContext);"
    1) introduce state variable for re-rendering
    2) pass component's dispatchSetState function to imported class which calls it to set value

    Through importing same "logicProcessor" class instance in any other component everywhere in 
    components tree current component's state can be changed through that class methods*/
  const [itemList, setItemList] = useState([]);


  useEffect(() => {
    //  !!!here we pass reference of setState() function to imported class instance
    logicProcessor.setItemListListener(setItemList); 
  }, []);

  return (
    <div>
      {itemList.map((item, index) => (
        <div key={index}> {item}
          {/*change state through imported class method instead of 
            passing setState() from ancestor component where state is 
            "lifted up" using Context API */}
          <span onClick={() => { logicProcessor.deleteElement(index) }}>
            [delete this item]</span>
        </div>
      ))}
    </div>
  )
}
export default ItemsList;