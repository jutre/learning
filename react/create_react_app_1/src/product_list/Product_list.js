// demonstration when use clicks on button "Change settings" and a div with form is shown, the div contains a "Close button" for hiding the dialog

import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";



const App = () => {
  
  //const [cartItems, setCartItems] = useState({});

  return(
    <div>
      <CartShortInfo/>
      <ProductList/>
    </div>
  )
}

function CartShortInfo(){
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalSumForCartItems, setTotalSumForCartItems] = useState(0);

  useEffect(() => {
    extClass.setTotalProductsCountFunc = setTotalProductsCount
    extClass.setTotalSumForCartItemsFunc = setTotalSumForCartItems
  }, []);

  console.log("short cart info" )
  return(
    <div>
      <pre>Total item count - {totalProductsCount}, total sum {Number(totalSumForCartItems).toFixed(2)}</pre>
    </div>
  )
}


function ProductList(){
  var productList = [{ 
    name: "product 1", price: 1.00},
    {name: "product 2", price: 2.10},
    {name: "product 3", price: 3.00}, 
    {name: "product 4", price: 4.00}];
  const [itemList, setItemList] = useState(productList);
  
  useEffect(() => {
    extClass.setItemListFunc=setItemList
    //setItemList(extClass.productList)
  }, []);

  console.log("product list")
  return(
    <div>
      <strong>Product list</strong>
        {itemList.map((item, index) => (
          <div key={index}>{item.name}
            <span onClick={() => {extClass.addToCart(item.name,1)}}
                  style={{cursor:'pointer'}}
            > [add to basket]</span> 
          </div>
        ))}
      </div>
  )
}

export default App;