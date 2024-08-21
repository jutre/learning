import { useEffect } from "react";
import { Link } from "react-router-dom";
import { routes } from "../config";
import BooksListParamProcessor from "./BooksListParamsProcessor";
import BooksListBody from "./BooksListBody";
import { setPageTitleTagValue } from "../utils/setPageTitleTagValue";

function BooksList() {
  
  useEffect(() => {
    setPageTitleTagValue("Books");
  }, []);

  return  (
    <div className="book_list">
      <h2>Books</h2>
      <div className="add_book_link">
        <Link to={routes.createBookPath}>Add book</Link>
      </div>
      <BooksListParamProcessor/>
      <BooksListBody/>
    </div>
  )
}


export default BooksList;