//every route is defined here which lets changin them easily
export const routes = {
    bookListPath:"/",
    favoriteBooksListPath:"/favorites/",
    bookEditPath:"/:bookId/edit/",
    createBookPath:"/create/"
};


export const bookCreatingFormFieldsDef = [
    { label: "Title", name: "title", type: "text", rule: "required" },
    { label: "Author", name: "author", type: "text", rule: "required" },
    { label: "Preface", name: "preface", type: "textarea" }];

//book editing form has same fields as new book creating form and an extra "id" field
export const bookEditFormFieldsDef = [
    ...bookCreatingFormFieldsDef,
    { label: "id", name: "id", type: "hidden" }
];
