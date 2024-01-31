// demonstration when use clicks on button "Change settings" and a div with form is shown, the div contains a "Close button" for hiding the dialog

import React, { useState, useEffect } from 'react';

import { external as extClass } from "./External";



const App = () => {
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [totalSumForCartItems, setTotalSumForCartItems] = useState(0);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    extClass.setTotalProductsCountFunc = setTotalProductsCount
    extClass.setTotalSumForCartItemsFunc = setTotalSumForCartItems
  }, []);

  return(
    <div>
      <pre>Total item count - {totalProductsCount}, total sum {Number(totalSumForCartItems).toFixed(2)}</pre>
      <ProductList/>

    </div>
  )
}




function ProductList(){
  const [itemList, setItemList] = useState([]);
  
  useEffect(() => {
    extClass.setItemListFunc=setItemList
    setItemList(extClass.productList)
  }, []);

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