# Description
This directory contains files with code that was created to learn and test various basic ascepts of React and some technical aspects.

Most notable files are:

### src/redux_study/redux_sample_app/Redux_sample_app.js
Training working with react, react-redux libraries. In this app state modifications are performed: creating, updating, deleting objects in Redux store.
Result can be viewed instantly - [https://codesandbox.io/p/sandbox/redux-training-app-pspzwz](https://codesandbox.io/p/sandbox/redux-training-app-pspzwz)


### src/Challenge.js 
Contains complete responsive design and functionality - a form that performs input validation and displays submit success message.
An email should be valid, must not end with ".co" (Columbian), checbox must be checked. After first submit with invalid data validation is being performed while typing.
Result can be viewed instantly - [https://codesandbox.io/p/sandbox/page-with-design-and-submit-form-x62rx3](https://codesandbox.io/p/sandbox/page-with-design-and-submit-form-x62rx3)

### src/better_solution_than_context_api/Add_remove_form.js. 
Solution that could be used instead of Context API that is 1) easier to mantain, 2) easier to test (using JEST) as business logic is enclosed in separate dedicated class and React components are used only to display data and invoke code from class that contains business logic prosessor, less coupling between files.

## How to switch to a chosen script
Uncomment path of chosen script in src/index.js
