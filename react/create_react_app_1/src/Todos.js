/*import { memo } from "react";
const Todos = ({ todos }) => {
    console.log("child render" + (new Date()).toLocaleTimeString());
    return (
      <>
        <h2>My Todos</h2>
        {todos.map((todo, index) => {
          return <p key={index}>{todo}</p>;
        })}
      </>
    );
  };
  
  export default memo(Todos);
*/
import React, { memo, useState, useCallback } from "react";

const Todos = (props) => {

  function getDateStr(){
    let date = new Date();
    let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
    return dateStr;
  }
  
  console.log("child render[index=" + props.index + "] - " + getDateStr());

  const [todos, setTodos] = useState([]);
  const [isShown, setIsShown] = useState(false);
  const [clicked, setClicked] = useState(false);

  const addTodo = useCallback(() => {
    setTodos((todos) => [...todos, "<" + (todos.length) + " - new todo " +  getDateStr() + ">"]);
  }, []);


  const handleClick = () => {
    //alert(clicked);
    setClicked ((prevClicked) => !prevClicked);
    //setClicked (true);
  }
  //console.table(todos);
  
  return (
  
    <div className="col-md-4">
      <h2>[{props.index}]My Todos</h2>
      {todos.map((todo, index) => {
        return <p key={index}>{todo}</p>;
      })}

      <button className="btn btn-primary" 
        onClick={addTodo}
        >Add Todo
      </button>
      
      <div style={{width:"100px", border:"1px solid red"}} 
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
        >Hover me!</div>
      
      <div onClick={ handleClick}>Click me "{clicked?"true": "false"}"</div>

      {isShown && (
        <div>
          I'll appear when you hover over the button.
        </div>
      )}

      <div className={isShown ? null : "hidden"} >
        Displays on hover
      </div>

      <div className={"initial-height" + (isShown ? " taller" : "")} >
        Taller on hover
      </div>
    </div>
  );
};

export default memo(Todos);

  