
const initialState = "init string value"

function reducerForStringValue(state = initialState, action) {
  switch(action.type) {   
    case 'SET_STRING_VALUE' : {
      return action.stringValue;
    }
    default : return state;
  }
}



export default reducerForStringValue;
