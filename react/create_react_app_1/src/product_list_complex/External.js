class External {
    constructor() {
      this.cart = {};

      this.productList = [{ 
        name: "product 1", price: 1.00},
        {name: "product 2", price: 2.10},
        {name: "product 3", price: 3.00}, 
        {name: "product 4", price: 4.00}];
    }
  

    //if product is not added to cart, adds it to cart in provided count
    //if product exists, add provided count to existing count
    addToCart(itemId, count = 1) {
      //add item to cart array property
      if(!this.cart.hasOwnProperty(itemId)){
        this.cart = {...this.cart, [itemId]:count}
      }else{
        var existingCount = this.cart[itemId]
        var newCount = count+existingCount
        this.cart = {...this.cart, [itemId]:newCount}
      }
      console.log("External obj logs cart ", this.cart )

      //count items, total sum and set them in component state, this must be done on product adding
      var totalItemsCount = this.getCartItemsCount()
      this.setTotalProductsCountFunc(totalItemsCount)
      var totalSumForCartItems = this.getTotalSumForCartItems()
      this.setTotalSumForCartItemsFunc(totalSumForCartItems)
    }


    getCartItemsCount(){
      var totalItemsCount = 0
      for (const key in this.cart) {
        totalItemsCount = totalItemsCount + this.cart[key]
      }
      
      return totalItemsCount;
    }

    getTotalSumForCartItems(){
      var totalSum = 0
      for (const key in this.cart) {
        console.log("ExtClass, look for price for product", key);
        var itemCount = this.cart[key]
        var itemPrice;
        //get price for current cart item from productList array
        for (let i = 0; i < this.productList.length; i++) {
          console.log("ExtClass, checking product", this.productList[i]);
          if(this.productList[i].name === key){
            itemPrice = this.productList[i].price
            break
          }
        }
        var sumForCurrentItem = itemCount * itemPrice
        totalSum = totalSum + sumForCurrentItem
      }
      
      return totalSum;
    }

    //delete from element from object field and set in in component
    deleteElement(elementIndex){
      this.itemsArr = [...this.itemsArr.slice(0, elementIndex), ...this.itemsArr.slice(elementIndex + 1)]
      this.setItemListFunc(this.itemsArr)
    }


    validate(inputStr){
      if(!inputStr){
        return "you must enter name"
      }else{
        return "";
      }
    }
  }

export const external = new External();