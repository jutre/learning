/**
 * returns books information list. Inteded to use for initial data loading to prefill application with books data or when user
 * changes data source in data source menu.
 * Returns either books list hard coded in this function or fetched from api available at openlibrary.org.
 * @param {string} dataSource - returns fetched data from remove api if parameter value is equal to "remote", otherwise
 * returns books list that is hard coded in this function
 * @returns 
 */
export async function getBooksInitialData(dataSource = "local") {
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
      resolve({books:booksArr});
    });
}