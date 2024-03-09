const arrayElementValue = "Always same value for array element";
const initialState = [arrayElementValue];

function todoReducer(state = initialState, action) {
  switch(action.type) {
    case 'TODO_ADD' : {
      return applyAddTodo(state, action);
    }
    case 'TODO_DELETE' : {
      return applyDeleteTodo(state, action);
    }
    default : return state;
  }
}

function applyAddTodo(state, action) {
  
  //testing in what case re-render happens
  /* returning larger array then previously
   - re-rendering happens of course - arrays are different */
  //return [...state, action.todo];
  /* returning always same array 
   - re-rendering happens - array instance is different*/
  return [arrayElementValue];
  /* returning "state" parameter value  
   - re-rendering does not happen - because it is same object. We see that object comparison is
   performed in shallowEqual() function in react-redux/lib/utils/shallowEqual.js 
   BUT function which was subscribed to store by store.subscribe(() => ()) call is executed*/
  //return state;
}

function applyDeleteTodo(state, action) {
  return state.filter(todo =>
    todo !== action.todo
  );
}

export default todoReducer;
