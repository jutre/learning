class External {
    constructor() {
      this.itemsArr = [];
      this.setInputErrorFunc = null;
    }
  
    showDialog(){
      this.setShowDialogFunc(true)
    }

    hideDialog(){
      this.setShowDialogFunc(false)
    }

    processFormSubmit = (newElem) => {
      //clear old errors
      this.setInputErrorFunc("")
      var errorMessages = this.validate(newElem)
      
      if(!errorMessages){
        //new element not empty, add to array, clear name in form
        this.itemsArr.push(newElem)
        this.setItemListFunc([...this.itemsArr])
        this.setNameFunc("")

      }else{
        //show error msg if empty
        this.setInputErrorFunc(errorMessages)
      }
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