class APIClient {
/**
   * returns books information list. Inteded to use for initial data loading to prefill application with books data or when user
   * changes data source in data source menu.
   * Returns either books list hard coded in this function or fetched from api available at openlibrary.org.
   * @param {string} dataSource - returns fetched data from remove api if parameter value is equal to "remote", otherwise
   * returns books list that is hard coded in this function
   * @returns 
   */
  fetchBooks = async (dataSource = "local") => {
      let booksArr;
    
      if(dataSource === "remote"){
        let data;
        //fetch twenty books
        let url = "https://openlibrary.org/search.json?q=Transistor+circuit&fields=key,title,author_name&page=1&limit=20";
        try {
          const response = await fetch(url);
          data = await response.json();
          if (!response.ok) {
            Promise.reject(new Error(`Error ${response.status}: ${response.statusText}`));
          }
        } catch (err) {
          return Promise.reject(err.message ? err.message : data)
        }
        booksArr = data.docs.map((bookInfo, arrIndex) => {
          return {
            //use array index as object id field value (one based as application does not allow zero indexes)
            id: arrIndex + 1, 
            title: bookInfo.title,
            //author field is array, create single string of authors from author names
            author: bookInfo.author_name.join(","),
            preface: "field for preface"
          }
        })
      }else{
        booksArr = [
          {
            id: 1,
            title: "Calculus, part one",
            author: "Gilbert Strang",
            preface: "field for preface"
          },
          {
            id: 2,
            title: "Calculus, part two",
            author: "Gilbert Strang",
            preface: "field for preface"
          },
          {
            id: 3,
            title: "Calculus, part three",
            author: "Gilbert Strang",
            preface: "field for preface"
          },
          {
            id: 4,
            title: "The basics of physics",
            author: "Steven Holzner",
            preface: "field for preface"
          },
          {
            id: 5,
            title: "Transistor circuit basics",
            author: "Charles Pike",
            preface: "field for preface"
          },
          {
            id: 6,
            title: "Calculus, part six",
            author: "Gilbert Strang",
            preface: "field for preface"
          },
          {
            id: 7,
            title: "Calculus, part seven",
            author: "Gilbert Strang",
            preface: "field for preface"
          },
          {
            id: 8,
            title: "Calculus, part eight",
            author: "Gilbert Strang",
            preface: "field for preface"
          }
        ];
      }
      
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({books: booksArr})
        }, 200)
      });
      
  }


  /**
   * returns favorite books information list. Inteded to use for initial data loading to prefill application with books data or when user
   * changes data source in data source menu where user can choose to load local or remote data (from openlibrary.org).
   * In case of fetching remote data (books are fetched from openlibrary.org), define empty array
   * which conforms to no any book added to favorite books list but when chooses local data, return favorites array filled with some values
   * to display some books marked as added to favorites. The intention of this is that user would see the difference in books list loaded 
   * from different data sources also in terms of added favorite books
   * 
   * @param string dataSource - if set to "remote", method will returns empty array list, otherwise returns non empty array
   * @returns array
   */
  fetchFavoriteBooksIds = async (dataSource = "local") => {
    let favoriteBooksIdsArr;
  
    if(dataSource === "remote"){
      //

      favoriteBooksIdsArr = [];

    }else{
      favoriteBooksIdsArr = [1, 3, 4];
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({favoriteBooks: favoriteBooksIdsArr})
      }, 200)
    });
  }

  /**
   * @param {object} newBookData - book data to be stored that would be sent to REST api endpoint
   * @returns - same value as passed in parameter "bookData" with added "id" field value. 
   */
  saveNewBook = async (newBookData) => {
    const date = new Date();
    const timeStr = "" + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
    const idFieldValue = parseInt(timeStr);
    //Clone original object which can be modified securely escaping possible issues caused by original object
    //modification as this is simulated REST client that did not receives data over network but returns
    //locally created promise returning modified data from passed argument value
    const bookDataAfterSaving = {id: idFieldValue, ...newBookData}

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({bookData: bookDataAfterSaving})
      }, 500)
    });
  }

  /**
   * @param {object} bookData - book data to be stored to update book that would be sent to REST api endpoint
   * @returns - same value as passed in parameter "bookData" possibly with some concatenated and/or updated fields
   */
  updateBook = async (bookData) => {
    //simulating lastUpdated field coming back from server after modification
    const date = new Date();
    const timeStr = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
    //Clone original object which can be modified securely escaping possible issues caused by original object
    //modification as this is simulated REST client that did not receives data over network but returns
    //locally created promise returning modified data from passed argument value
    const bookDataAfterUpdating = { ...bookData, lastModified: timeStr }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ bookData: bookDataAfterUpdating })
      }, 500)
    });
  }

  /**
   * @param {int[]} bookIdsArr - array of integers, would be sent to REST api 
   * @returns - object with success message as it would be returned from REST api backend in case of success
   */
  deleteBooks = async (bookIdsArr) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "book have been deleted" })
      }, 500)
    });
  }
  
}

export const apiClient = new APIClient();