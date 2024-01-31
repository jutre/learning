import { external as extClass } from "./External";


var totalCount;
function setTotalProductsCountFunc(value){
  console.log("setTotalProductsCountFunc with ", value)
  totalCount = value;
}

var errorMessage = undefined;
function setErrorMessageFunct(value){
  errorMessage = value;
}

var itemList = undefined;
function setItemListFunct(value){
  itemList = value;
}

var name = undefined;
function setNameFunct(value){
  name = value;
}

test('test adding an item to cart array', () => {
  extClass.setTotalProductsCountFunc = setTotalProductsCountFunc
  extClass.cart = {} //make cart empty
  console.log("empty cart ", extClass.cart )

  //add a product to cart
  var productOneId = "product_1"
  var productOneCount = 3;
  extClass.addToCart(productOneId, productOneCount)
  //cart object should contain only one property as we added one product to empty object
  expect(Object.keys(extClass.cart).length).toBe(1);
  //product id and count should match
  expect(extClass.cart[productOneId]).toBe(productOneCount);
  //total products count should be equal to productOneCount as we added only it
  expect(totalCount).toBe(productOneCount);
  console.log("after adding one item to cart ", extClass.cart, ", total is ", totalCount)


  //adding second product
  var productTwoId = "product_2"
  var productTwoCount = 1;
  extClass.addToCart(productTwoId, productTwoCount)
  //cart object should contain two properties
  expect(Object.keys(extClass.cart).length).toBe(2);
  //product id and count should match
  expect(extClass.cart[productTwoId]).toBe(productTwoCount);
  //total products count should be equal to productOneCount plud productTwo count 
  //as we added them both
  expect(totalCount).toBe(productOneCount + productTwoCount);
  console.log("after adding two items to cart ", extClass.cart, ", total is ", totalCount)

  //add two more "product 1" items
  var additionalProductOneCount = 2
  extClass.addToCart(productOneId, additionalProductOneCount)
  //cart object still should contain two properties
  expect(Object.keys(extClass.cart).length).toBe(2);
  //productOne count should be initial amount added additional count
  expect(extClass.cart[productOneId]).toBe(productOneCount + additionalProductOneCount);
  //total products count should be equal to productOneCount plus productTwo count 
  //plus additional product count
  expect(totalCount).toBe(productOneCount + productTwoCount + additionalProductOneCount);
  console.log("after adding two additional productOne items to cart ", extClass.cart, ", total is ", totalCount)

});
/*
test('submitting empty name must set error message "you must enter name"', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;

  var newArrayElement = "";
  extClass.processFormSubmit(newArrayElement);
  expect(errorMessage).toBe("you must enter name");
});


test('when submitting non empty name, element must be added to array,', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;
  extClass.setItemListFunc = setItemListFunct;
  extClass.setNameFunc = setNameFunct;

  itemList = [];//initializing as arr because processFormSubmit uses array functions internally
  var newArrayElement = "new arr item";
  extClass.processFormSubmit(newArrayElement);

  //err message is empty as new item is not empty
  expect(errorMessage).toBe("");

  //reset name to empty
  expect(name).toBe("");

  //array contains only added element
  expect(itemList[0]).toBe(newArrayElement)
  expect(itemList.length).toBe(1)
  
  //adding one more element, array size is two, new element is as second element
  extClass.processFormSubmit("one more element");
  expect(itemList.length).toBe(2)
  expect(itemList[1]).toBe("one more element")
});


test('when deleting single existing element, array must be empty', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;
  extClass.setItemListFunc = setItemListFunct;
  extClass.setNameFunc = setNameFunct;

  extClass.itemsArr = ["single element"];//create arr with one element in class field
  extClass.deleteElement(0)
  //array in class field, in variable set by setter function should be empty
  expect(extClass.itemsArr.length).toBe(0)
  expect(itemList.length).toBe(0)
});


test('when deleting element, it must be removed from array, other element should stay in array', () => {
  extClass.setInputErrorFunc = setErrorMessageFunct;
  extClass.setItemListFunc = setItemListFunct;
  extClass.setNameFunc = setNameFunct;

  //check deleting first element from two (array in class field, in variable set by setter function should be equal)
  extClass.itemsArr = ["elem1", "elem2"];
  extClass.deleteElement(0)

  expect(extClass.itemsArr.length).toBe(1)
  expect(extClass.itemsArr[0]).toBe("elem2")
  
  expect(itemList.length).toBe(1)
  expect(itemList[0]).toBe("elem2")

  //check deleting second element from two (array in class field, in variable set by setter function should be equal)
  extClass.itemsArr  = ["elem1", "elem2"];
  extClass.deleteElement(1)
  
  expect(extClass.itemsArr.length).toBe(1)
  expect(extClass.itemsArr[0]).toBe("elem1")
  
  expect(itemList.length).toBe(1)
  expect(itemList[0]).toBe("elem1")

  //check deleting second element from three (array in class field, in variable set by setter function should be equal)
  extClass.itemsArr  = ["elem1", "elem2", "elem3"];
  extClass.deleteElement(1)
  expect(extClass.itemsArr.length).toBe(2)
  expect(extClass.itemsArr[0]).toBe("elem1")
  expect(extClass.itemsArr[1]).toBe("elem3")

  expect(itemList.length).toBe(2)
  expect(itemList[0]).toBe("elem1")
  expect(itemList[1]).toBe("elem3")
});


import sum from './sum';

var globVar = undefined;
var globVar2 = undefined;

function tf(){
    return 1;
}

var tfvar = tf;

function tf2(){
    return globVar;
}

function outerFunct(result){
    globVar2 = result;
}

beforeAll(() => {
    globVar = 55;
  });


class External {
  constructor() {
    this.left = 0;
    this.right = 0;
    this.finalCall = null;
  }

  registerFinalCall = (finalCall) => {
    this.finalCall = finalCall;
  };

  doFinalCall = () => {
    this.finalCall(Number(this.left) + Number(this.right));
  };
}

test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});


test('tf returns one', () => {
    expect(tf()).toBe(1);
});

test('tfvar returns one', () => {
    expect(tfvar()).toBe(1);
});

test('tf2 returns value of globVar which is 55', () => {
    
    expect(tf2()).toBe(55);
    expect(globVar).toBe(55);
});

test('summing by external 3+2 expecting to be 5', () => {
    var extClass = new External();
    extClass.registerFinalCall(outerFunct);
    extClass.left = 3;
    extClass.right = 2;
    extClass.doFinalCall();
    expect(globVar2).toBe(5);
});

*/