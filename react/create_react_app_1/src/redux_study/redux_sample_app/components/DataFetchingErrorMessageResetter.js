import { useEffect } from "react";
import store from '../store/store';
import {
  selectBooksFetchingStatus,
  statusSetToIdle,
  STATUS_REJECTED
} from "../features/booksSlice";
import { useLocation } from "react-router-dom";

/**
 * resets data fetching error message when user goes to any other page than he currently is by using any link.
 * Data fetching error message may appear after user changes initial data source in settings menu. If new data fetching
 * fails, error message is displayed but the previous data is not changed, user can still navigate to any link related
 * to existing data, for example, user can navigate to book editing page and on page user navigates error message must not
 * be displayed any more. 
 * Technically his component sets book loading state is to "idle" if current state is "rejected"
 * 
 * @returns always returns null, component is intended to do redux state updating 
 */
function DataFetchingErrorMessageResetter() {
 
  //it is needed to call a hook from react-router to cause this component to re-render when react-router generated 
  //page url is changed. It is needed to be aware of url changing because once data fetching error message is displayed
  //after data fetching fails and user goes to any other page using any link on page then error message should disaper
  useLocation();
  
  let fetchingStatus = selectBooksFetchingStatus(store.getState()); 

  //main logic - check if current status is "rejected" and set is to "idle"
  useEffect(() => {
      if(fetchingStatus === STATUS_REJECTED){
        store.dispatch(statusSetToIdle());
      }
  });
  
  //nothing to return as component intended only for state resetting
  return null;
  
}

export default DataFetchingErrorMessageResetter;
