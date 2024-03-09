import { routes } from "../config";
import PageHeader from "./PageHeader";
import BookEditing from "./BookEditing";
import BooksList from "./BooksList";
import CreateBook from "./CreateBook";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";






const Layout = () => {
  return (
    <div className="root_container">
      <div className="layout_wrapper"><PageHeader/></div>
      <div className="layout_wrapper content_wrapper">
        <Router>
            <Routes>
              <Route path={routes.bookListPath} element={<BooksList/>}/>  
              <Route path={routes.bookEditPath} element={<BookEditing/>}/>
              <Route path={routes.createBookPath} element={<CreateBook/>}/>
            </Routes>   
        </Router>
      </div>
    </div>
  )
}
export default Layout;