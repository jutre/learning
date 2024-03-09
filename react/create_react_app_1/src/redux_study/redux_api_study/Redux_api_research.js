import React, {useEffect } from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import store from './store/store';

/**
 * this component will display state from redux store, element type will be array
 * 
 * @param arrElementsProp
 * @returns 
 */
const ListOfArrayElementsFromReduxStore = ({ arrElementsProp }) => {
  console.log("rendering happens - ListOfArrayElementsFromReduxStore");

  return  (
    <div>
      List content:
      {(arrElementsProp || []).map((elem, index)  =>
        <div key={index}>
          {elem}
        </div>
      )}
    </div>
  )
}

function todosSelector(state){
  return state.todoState;
}
const mapStateToPropsListOfArrayComponent = state => ({
  arrElementsProp:  todosSelector(state),
});

// const mapDispatchToProps = dispatch => ({
//   onArchive: id => dispatch(doArchiveStory(id)),
// });

const ListComponentConnectedToRedux = connect(
  mapStateToPropsListOfArrayComponent/*,
  mapDispatchToProps*/
)(ListOfArrayElementsFromReduxStore);




/**
 * Displays state from redux store, element type will be string
 * Also testing dispatch function passed as property to react-redux connect function
 * 
 * @param stringValue
 * @returns 
 */
const StringValueFromReduxStore = (props) => {
  console.log("rendering happens - StringValueFromReduxStore, props are", props);

  return  (
    <div>
      String value from state - [{props.stringValueProp}].
      <br/><br/>
      <div onClick = {() => props.launchDispatching("1st arg from string componenent", "2nd argument from string component")
                   }>Click to launch redux dispatch() function from a connected component.
      </div>
    </div>
  )
}

function stringValueSelector (state){
  return state.stringValueState;
}
const mapStateToPropsStringValueComponent = state => ({
  stringValueProp:  stringValueSelector(state),
});

/**
 * testing two parameter passing to function that creates action in component
 * @param {*} dispatch 
 * @returns 
 */
const mapDispatchToProps = dispatch => ({
  launchDispatching: (newStr, secParam) => 
                        dispatch({type: 'SET_STRING_VALUE',  
                                  stringValue: `String value set in component - "${newStr}", sec argument is '"${secParam }"`}),
});

const StringValueComponentConnected = connect(
  mapStateToPropsStringValueComponent,
  mapDispatchToProps/**/
)(StringValueFromReduxStore);

const RootComponent = () => {
  useEffect(() => {
    //to see whats in store after every action
    store.subscribe(() => {
      console.log("output of store's state from store subscribtion function", store.getState());
    });

    console.log("initial render, store content", store.getState());

  }, []);
  
  
  console.log("rendering happens - RootComponent");

  return(
    <div>
      <h2>Figuring out what causes re-render in React when connect() function from react-redux is used</h2>
      
      <div onClick={() => {
                      store.dispatch({ type: 'TODO_ADD',  todo: "Todo 1 text"});
                      console.log("logs logs case 2, the state in store", store.getState());
                    }}> 
        1. case [click here] and see store's state in console, element is added to store, store element is of array type, 
            see if state is changed immediately after dispatch() function call.<br/><br/>
      </div>
      <div>
        This is the element which prop connected to value is redux store - 
        <ListComponentConnectedToRedux/>
        <br/>
      </div>
      
      <div>Conclusion: 1) element is added to store immediatelly, available by invoking store.getState(); 
            2)array values change causes re-render - see comments is todoReducer()</div>

      <hr/>

      <div onClick={() => {
                      store.dispatch({ type: 'SET_STRING_VALUE',  stringValue: "String value after click"});
                      console.log("logs case 2, the state in store", store.getState());
                    }}> 
        2.  [click here] and see store's state in console, element is added to store, store element is of array type, 
            see if state is changed immediately after dispatch() function call.<br/><br/>
      </div>

      <StringValueComponentConnected/>
      <br/>
      <div>Conclusion: if string value returned by reducer is same, component does not re-render. Shallow comparison really works
        (function in react-redux/lib/utils/shallowEqual.js). But experimenting with objects with same properties and same propertie's
        value (not in current code, just tried and restored forStringValue.js reducer) for some reason caused re-render
      </div>

      <hr/>
      
    </div>
  )
}
//
const App = () => {
  return (
    <Provider store={store}>
      <RootComponent/>
    </Provider>
  )
}
export default App;