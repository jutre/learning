/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
*/

import React, { useState, useEffect } from 'react';
//import  from "react";
import ReactDOM from "react-dom/client";
import './bootstrap.min.css';
import './index.css';
import Todos from "./Todos";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams, 
  useNavigate
} from "react-router-dom";

function getDateStr(){
  let date = new Date();
  let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
  return dateStr;
}

function BasicExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard?id=1">Dashboard</Link>
          </li>
        </ul>


        {/*
          A <Routes> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Routes> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Routes>
          <Route path="/" element={<Home/>}/>
            
          <Route path="/about" element={<About/>}/>
         
          <Route path="/dashboard" element={<Dashboard/>}/>
            
        </Routes>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}


function Edit() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  console.log('Edit - param from path', bookId);

  console.log('rendering Edit', getDateStr());
  return (
    <div>
      <h2>Edit</h2>
      <div>param from path value [{bookId}]</div>
      <div onClick={()=>{navigate("/edit")}}>Navigate to editing without params</div>
    </div>
  );
}

/*
function PostDispaly(){
  const [items, setItems] = React.useState(null);
  console.log("PostDispaly " + getDateStr());
  useEffect(() => {
    console.log("PostDispaly - useEffect " + getDateStr());
    fetch('http://localhost/postsapi.php?return_empty=true')
        .then(response => response.json())
        .then((responseData)=> {setItems(responseData)});
  }, []);

  if (items === null) return 'Loading...';

  return (
      <div>
          {items.length === 0 && (
              <p>No items yet!</p>
          )}
          {items.map(item => (
              <p key={item.id}>{item.title}</p>
          ))}
      </div>
  );
}
*/

/*
class ExternalClass{
  sum(p1, p2) {
    return p1 + p2;
  }

  processSumCalc(left, right){
    this.totalSumFunc(this.sum(left, right)) 
    // totalSumFunc points to state setter in component
  }
}
var externalClass = new ExternalClass();

function MyComponent(){
  const [totalSum, setTotalSum] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);

  useEffect(() => {
    // !!! handle control over state function to externalClass
    externalClass.totalSumFunc = setTotalSum
  }, []);

  return (
    <>
      left: <input onKeyUp={e => setLeft(e.target.value)} />
      <br/>
      right: <input onKeyUp={e => setRight(e.target.value)} />
      <br/>
      <button onClick={() => {
                         externalClass.processSumCalc(left, right);
                      }}
      ></button>
      <br/> 
      Total is - {totalSum}
    </>
  )
}
*/

function PostDispaly(props){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("PostDispaly " + getDateStr());

  //initially load data
  useEffect(() => {
    loadData(false);
  }, []);
  
  const loadData = (loadEmptyArray) => {
    console.log("PostDispaly - loadData " + getDateStr());

    let arraySizeParam = "";
    if(loadEmptyArray){
      arraySizeParam = "?return_empty=true";
    }
    setLoading(true);

    fetch('http://localhost/postsapi.php' + arraySizeParam/*, {credentials: 'include'}*/)
        .then(response => response.json())
        .then((responseData) => {
          //setItems(responseData);
          setItems(items.concat(responseData));
          setLoading(false);
        })
        .catch((err) => {
          console.log("error occured " + err.message);
          setLoading(false);
        });
  }



  return (
      <div>
        <button className="btn btn-primary" onClick={() => loadData(true)}>Load zero items</button>
        <button className="btn btn-primary" onClick={() => loadData(false)}>Load not empty items</button>
        {loading && "Loading..."}
        {items.length === 0 && (
          <p>No items yet!</p>
        )}
        {/*items.map(item => (
            <p key={item.id}>{item.title}</p>
        ))*/}
        <div>
          {items.map((item, index) => (
              <span  key={index}>[{index}] - {item.title}, </span>
          ))}
        </div>
        {props.children}
      </div>
  );
}



const App = () => {
  const [count, setCount] = useState(0);
  const [renderedForFirstTime, setRenderedForFirstTime] = useState(false);
  
  console.log("AppDispaly " + getDateStr());

  //ofter first render changes renderedForFirstTime to add class to div on second render to demonstrate transition after page
  //display
  useEffect(() => {
    console.log("AppUseEffect " + getDateStr());
    setRenderedForFirstTime(true);
  }, []);
  
  const increment = () => {
    setCount((c) => c + 1);
  };
  
  let rows = [];
  for(var i = 0; i < 6; i++){
    rows.push(<Todos key={i}  index={i}/>);
  }

  return (
    <div className="container">
      <h6>Todos</h6>
      <div className="row show-grid">
        {rows}
      </div>
      <hr />
      
      <h6>Posts</h6>
      <PostDispaly/>
      <hr />

      <h6>Router</h6>
      <BasicExample/>
      <hr />

      <h6>Counter</h6>
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
      </div>
      <hr />

      <h6>Class change after displaying</h6>
      <div className={renderedForFirstTime ? "initial-width wider" : "initial-width"} >
        wider after redering for first time
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)


/*
import React from 'react';
import ReactDOM from "react-dom/client";

function Counter() {
  const [count, setCount] = React.useState(0);
  const [calculation, setCalculation] = React.useState(0);

  React.useEffect(() => {
    setCalculation(() => count * 2);
  }, [count]); // <- add the count variable here

  
  function updateCount(){
    setCount((c) => c + 1);
  }


  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={updateCount}>+</button>
      <p>Calculation: {calculation}</p>
     
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Counter />)
*/

/*
import { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import Todos from "./Todos";

const App = () => {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);

  const increment = () => {
    setCount((c) => c + 1);
  };
  const addTodo = useCallback(() => {
    setTodos((t) => [...t, "New Todo"]);
  }, []);

  return (
    <>
      <Todos todos={todos} addTodo={addTodo} />
      <hr />
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
      </div>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

*/


/*

function getDateStr(){
  let date = new Date();
  let dateStr = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + "ms";
  return dateStr;
}


var globalVar = [];

function notifyConsumers(){
  for (const stateSetter of globalVar) {
    stateSetter("set from other component");
  }
}

function SampleComponent(){


  console.log("SampleComponentDispaly " + getDateStr());

  const [sampleState, setSampleState] = useState("initial state in SampleComponent");

  useEffect(() => {
    globalVar.push(setSampleState);
  }, []);

  var someHtml = <span>test "{sampleState}"</span>;

  return (
    <div className="container red-border">This is from SampleComponent, state value is "{sampleState}", <br/>
    from variable containing html = "{someHtml}"</div>
  )
}

const App = () => {
  const [wasClicked, setWasClicked] = useState(false);
  
  console.log("AppDispaly " + getDateStr());

  console.log('global var len',globalVar.length, "global var iteself", globalVar);

  var varPointsToComponent = <SampleComponent/>;
  console.log('var points to compoenent', varPointsToComponent);

  return (
    <div className="container red-border" >
      
      <div  onClick={ () => {
              setWasClicked(true)
              notifyConsumers();
            }}
      >
        has click handler
      </div>
      <div> wasClicked = {String(wasClicked)}, {`output from interolation: ${wasClicked}`}</div>
      <SampleComponent/><SampleComponent/>{varPointsToComponent}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />)

*/

/*
//validating form

const App = () => {
  const [name, setName] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    //extClass.registerFinalCall(setCount)
  }, []);


  const handleSubmit = (event) => {
    event.preventDefault();
    
    //clear old errors
    setInputError("")

    if(name === ""){
      setInputError("you must enter name")
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
        <input
          type="text" 
          value={name}
          onChange={(e) => {setName(e.target.value)}
                  }
        /> {
        }input errro "{inputError}"
      </label>

      <div>entered - "{name}"</div>
      <label><input type="submit" /></label>
    </form>
  )
};

*/