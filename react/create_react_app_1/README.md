






# Description
This directory contains files with code that was created to learn various ascepts of React. Directory structure and
webpack configuration was created using "Create React App" script. The /src directory contains multiple independent React application placed 
in files immediatelly in /src directory or in it's subdirectories. Such structure was created instead of generating new "create-react-app" project for every new React application. To launch choosen application, it is needed to import an application's root component using import statement in src/index.js (by uncommenting needed line), the root component's identifier always is "App".

To launch application you have to execute "npm start" in command line from current directory - as described in "Create React App" documentation.

## Most complete or interesting applications:

### src/redux_study/redux_sample_app/Redux_sample_app.js
Application which uses Redux for state management. It is a single page application which exchanges data using REST api. Redux store
uses multiple substates residing in separate slices (Redux Toolkit library is used). The interaction between state in slices is
implemented while creating, updating and deleting objects in slices' state.\
The implemented application is a book list with ability to create, update, delete books, add or remove then from favorites list. 
Appropriate state updates are made across multiple slices' state when book is deleted.

No data sending over network is happening when working with REST api, instead of that REST api client functions return appropriate data
that would be returned by REST client to Redux thunk. REST client returns data with some delay which lets demonstrate data loading
process indication in UI.

Application has almost all typical UI elements that a web page can have: dropdown menu, modal dialog, a settings menu that can be
activated by control icon, multiple items selection/unselection functionality in items list, page has search form which displays results in dynamic way. There are data sending indicators, data sending failure indicators (REST api client simulates error responses for some cases).
Design is responsive on all devices. Accessibility also is concerned - all interactive elements are highlighted when page elements are
navigated using TAB key.\
A component was created that lets easily generate HTML form by defining it's structure using array of objects.


Result can be viewed instantly - [https://codesandbox.io/p/sandbox/redux-training-app-pspzwz](https://codesandbox.io/p/sandbox/redux-training-app-pspzwz)


### src/Challenge.js 
Contains complete responsive design and functionality - a form that performs input validation and displays submit success message.
An email should be valid, must not end with ".co" (Columbian), checbox must be checked. After first submit with invalid data validation is being performed while typing.
Result can be viewed instantly - [https://codesandbox.io/p/sandbox/page-with-design-and-submit-form-x62rx3](https://codesandbox.io/p/sandbox/page-with-design-and-submit-form-x62rx3)

### src/better_solution_than_context_api/Add_remove_form.js. 
Solution that could be used instead of Context API that is 1) easier to mantain, 2) easier to test (using JEST) as business logic is enclosed in separate dedicated class and React components are used only to display data and invoke code from class that contains business logic prosessor, less coupling between files.