import { routes } from "../config";
import { FAVORITE_BOOKS_LIST } from "../constants/bookListModes";
import SettingsMenu from "./settings_menu/SettingsMenu";
import PageHeader from "./page_header/PageHeader";
import BookEditing from "./BookEditing";
import BooksList from "./books_list/BooksList";
import CreateBook from "./CreateBook";
import BooksListTypeMenu from "./BooksListTypeMenu";
import DataFetchingProgressIndicator from "./DataFetchingProgressIndicator";
import {
        BrowserRouter as Router,
        Routes,
        Route } from "react-router-dom";
import DataFetchingErrorMessageResetter from "./DataFetchingErrorMessageResetter";

const Layout = () => {
  return (
    <div className="root_container">
      <Router>
        {/*DataFetchingErrorMessageResetter does not output anytning but must be child of react router <Router> child
        to receive data from react router context to use it's api */}
        <DataFetchingErrorMessageResetter/>

        <div className="left_column">
          <BooksListTypeMenu/>
        </div>
        <div className="central_column"> 
          {//book edit form, book list with couple of books are too short to span till browsers bottom. Thoose divs create content column 
            //with it's background that spans till end of browser window. That might be achieved with flex layout, but it is needed
            //to place menu item under level of header but that would not be possible in flex container as absolute flex item
            //would be placed at the beginning of flex container
          }
          <div className="container_for_background_div">
            <div className="layout_wrapper content_wrapper horizontal_background_container"></div>
          </div>

          

          <div className="layout_wrapper">
            <PageHeader/>
            <SettingsMenu/>
          </div>

          <div className="layout_wrapper content_wrapper">
            
             
            
            
            <DataFetchingProgressIndicator/>
            
              <Routes>
                <Route path={routes.bookListPath} element={<BooksList />} />
                <Route path={routes.favoriteBooksListPath} element={<BooksList listMode={FAVORITE_BOOKS_LIST}/>} />
                <Route path={routes.bookEditPath} element={<BookEditing />} />
                <Route path={routes.createBookPath} element={<CreateBook />} />
              </Routes>
            
          </div>
        </div>
        <div className="right_column"></div>
      </Router>
    </div>
  )
}
export default Layout;
