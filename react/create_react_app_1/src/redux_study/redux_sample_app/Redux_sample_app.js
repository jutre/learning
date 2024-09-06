import { Provider } from 'react-redux';
import store from './store/store';
import { fetchBooks } from "./features/booksSlice";
import Layout from "./components/Layout";
import "./App.scss";

/**
 * 
 * This app was created to get experience with react, react-redux libraries. 
 * 
 * In this app state modifications are performed: creating, updating, deleting objects in redux store
 */
const App = () => {

  //load books on first and only render of this component before other components that uses data renders
  //store.dispatch(fetchBooks("https://openlibrary.org/search.json?q=Transistor+circuit&fields=key,title,author_name,cover_i&page=1&limit=20"));
  store.dispatch(fetchBooks());

  return (
    <Provider store={store}>
      <Layout/>
    </Provider>
  )
}
export default App;