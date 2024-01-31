import { external as extClass } from "./External";

var errorMessage = undefined;
function setErrorMessageFunct(value){
  errorMessage = value;
}


var name = undefined;
function setNameFunct(value){
  name = value;
}

var showForm = undefined;
function setShowFormFunct(value){
  showForm = value;
}

test('submitting empty name must set error message "you must enter name", snow form must be se to "true"', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;
  extClass.setShowFormFunc = setShowFormFunct;

  var name = "";
  extClass.processFormSubmit(name);
  expect(errorMessage).toBe("name must be not empty");
  expect(showForm).toBe(true);
});


test('when submitting non empty name, element must be added to array,', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;
  extClass.setShowFormFunc = setShowFormFunct;

  var name = "name value";
  extClass.processFormSubmit(name);
  expect(errorMessage).toBe("");
  expect(showForm).toBe(false);
});


