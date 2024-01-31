class External {

    /*constructor() {
      this.name = "";
      this.setInputErrorFunc = null;
    }*/
  
    processFormSubmit = (name) => {
      //clear old errors
      this.setInputErrorFunc("")
      
      //name entered, check is is at least three symbols long
      if(name){
        if(name.length < 3){
          this.setInputErrorFunc("name must be at least three symbols long")
          this.setShowFormFunc(true)

        //everytning ok, can submit data and show sucess message
        }else{
          this.setShowFormFunc(false)
        }
        
      //show error msg if name not entered
      }else{
        this.setInputErrorFunc("name must be not empty")
        this.setShowFormFunc(true)
      }
    }


  }

export const external = new External();