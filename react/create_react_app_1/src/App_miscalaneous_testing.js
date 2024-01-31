import React, {  useState, useEffect } from 'react';

import './App.css';
import './sassTest.scss';

function returnsSomeValue(){
  return "from returnSomeValue"
}

function App() {
  const [stateVar, setStateVar] = useState("initialStateVar");
  const [stateVarAsyncTest, setStateAsyncTest] = useState([{
    "userId": 1,
    "id": 1,
    "title": "initial title set in useState()",
    "body": "body 1"
  }]);

  const [afterLoading, setAfterLoading] = useState("not loaded yet");

  const [scrollPosition, setScrollPosition] = useState(0);


  useEffect(() => {  
    //testing how to pass "dispatchSetState" function to other function
    function testFunct(param){
      setStateVar(param) //this is the "setState" function created by React
    }
    testFunct("dispatchSetState was passed to other function as param and called inside")
    
    
    //==================================================
    //testing async when it is NOT async
    async function  loadData (){
      //using "await" blocks execution
      const response = await fetch('http://localhost/postsapi.php')
      console.log(response);
      const responseData = await response.json();
      console.log("response promise", responseData);
      setStateAsyncTest(responseData)
      setAfterLoading("loading lauched")

      //---------this is Promise using, realy async------------
      /*
      const fetchPromise =  fetch('http://localhost/postsapi.php')
      console.log("log response Object ", fetchPromise);
      let responseData = fetchPromise.then( responsePromiseValue => {responseData = responsePromiseValue.json(); return responseData;})
      //console.log('+response in loadData now 2 ',responseData)
      responseData.then( json=> {console.log('+response in loadData now 3 ',json); setStateAsyncTest(json)});
      setAfterLoading("loading lauched")
      console.log('after loading'); */

    }

    loadData ()


    //==================================================
    //==================================================
    //==================================================
    window.addEventListener("scroll", (e) => {
      setScrollPosition(window.scrollY)
    });
  }, []);


  console.log('async data rende ', stateVarAsyncTest);


  /*this will be passed as arg to other function and called inside that function */
  /*function funcPassableAsArg(param1){
    console.log('from "funcPassableAsArg", param1 value ="' + param1 + '"');
  }
  //let outerFunction = paramWillBeFunct => paramWillBeFunct("this param is passed to inner function inside outer func 'f1'")
  function outerFunction (paramWillBeFunct) {paramWillBeFunct("this param is passed to inner function inside outer func 'f1'")}
  outerFunction(funcPassableAsArg)*/


  return (
    <div className="App">
      
      {/* for sass test */}
      <div  className="test-media-queries"> 
            test media queries when "max-width" used
            <span className="child-of-test-media-queries"> child-of-test-media-queries</span>
      </div>
      <hr className='separator' />



      <div>State var now - [{stateVar}]. It was set in use effect</div>
      <hr className='separator' />


      
      
      <div>Test usage of returned value from function in jsx - [{returnsSomeValue()}]</div> 
      <hr className='separator' />


      
      
      <div>Test set value using fetch() and NOT using async <br/>
      was loading launched - [{afterLoading}]
        {stateVarAsyncTest.map(item => (
              <p key={item.id}>{item.title}</p>
          ))}    
      </div> 
      <hr className='separator' />




      <div style={{position:'fixed', top:10, left:10}}>Window scroll position - {scrollPosition}</div>
    
    </div>
  );
}

export default App;
