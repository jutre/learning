import { routes } from "../config";
import { FAVORITE_BOOKS_LIST } from "../constants/bookListModes";
import SettingsMenu from "./settings_menu/SettingsMenu";
import PageHeader from "./page_header/PageHeader";
import BookEditing from "./BookEditing";
import BooksList from "./books_list/BooksList";
import CreateBook from "./CreateBook";
import BooksListTypeMenu from "./BooksListTypeMenu";
import { useSelector } from 'react-redux';
import { selectBooksFetchingStatus } from "../features/booksSlice";
import {
        BrowserRouter as Router,
        Routes,
        Route } from "react-router-dom";

const Layout = () => {
  let fetchingStatus = useSelector(state => selectBooksFetchingStatus(state));

  return (
    <div className="root_container">
      <Router>
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
            {fetchingStatus === "rejected" &&
              <div className="error">fetching books has failed</div>}
            {fetchingStatus === "loading" ? 
              <div>loading...</div>
              :
              <Routes>
                <Route path={routes.bookListPath} element={<BooksList />} />
                <Route path={routes.favoriteBooksListPath} element={<BooksList listMode={FAVORITE_BOOKS_LIST}/>} />
                <Route path={routes.bookEditPath} element={<BookEditing />} />
                <Route path={routes.createBookPath} element={<CreateBook />} />
              </Routes>
            }
          </div>
        </div>
        <div className="right_column"></div>
      </Router>
    </div>
  )
}
export default Layout;
