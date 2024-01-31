class External {
    constructor() {
      this.cartSummary = {itemsCount:0, totalSum:0};
    }
  
    addToCart(itemId, count = 1) {

      var cartInfoFromServer = this.addToCartOnServer(itemId, count)
 
      if(cartInfoFromServer.error === undefined){
        this.cartSummary = cartInfoFromServer
        //count items, total sum and set them in component state, this must be done on product adding
        var totalItemsCount = this.getCartItemsCount()
        this.setTotalProductsCountFunc(totalItemsCount)

        var totalSumForCartItems = this.getTotalSumForCartItems()
        this.setTotalSumForCartItemsFunc(totalSumForCartItems)
      }
    }


    getCartItemsCount(){
      return this.cartSummary.itemsCount;
    }

    getTotalSumForCartItems(){
      return this.cartSummary.totalSum;
    }

    //would submit new product to server and as response get total items count and total sum
    //for now set current timestamp as total sum to get changing value
    addToCartOnServer(productId, count){
      var totalCount = this.cartSummary.itemsCount += count
      return {itemsCount:totalCount, totalSum:Date.now()}
    }
  }

export const external = new External();