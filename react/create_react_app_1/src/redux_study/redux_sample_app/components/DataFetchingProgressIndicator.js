
import { useSelector } from 'react-redux';
import {
  selectBooksFetchingStatus,
  STATUS_LOADING, 
  STATUS_REJECTED
} from "../features/booksSlice";


function DataFetchingProgressIndicator () {

  let fetchingStatus = useSelector(state => selectBooksFetchingStatus(state));
    
  return (
    <>
      {fetchingStatus === STATUS_REJECTED &&
        <div className="loading_status_indicator">
          <div className="error">data fetching has failed</div>
        </div>
      }
      {fetchingStatus === STATUS_LOADING && 
        <div className="loading_status_indicator">loading...</div>
      }
    </>
  )
}

export default DataFetchingProgressIndicator;