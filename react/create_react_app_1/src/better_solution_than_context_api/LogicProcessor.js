class LogicProcessor {
  itemsArrStore = null;
  itemListListener = null;
  inputErrorListener = null;
  nameListener = null;
  
  constructor() {
    this.itemsArrStore = [];
  }
  /**
   * @param callback component's dispatchSetState() function 
   */
  setItemListListener(callback){
    this.itemListListener = callback;
  }

  setInputErrorListener(callback){
    this.inputErrorListener = callback;
  }
  
  setNameListener(callback){
    this.nameListener = callback;
  }

  processFormSubmit(newElem){
    this.inputErrorListener(""); //clear old errors
    if (newElem) {
      this.itemsArrStore.push(newElem);
      this.itemListListener([...this.itemsArrStore]);
      this.nameListener(""); //clear input field after adding to list
    } else {
      this.inputErrorListener("field can not be empty"); 
    }
  }

  deleteElement(elementIndex) {
    this.itemsArrStore = [...this.itemsArrStore.slice(0, elementIndex), 
                          ...this.itemsArrStore.slice(elementIndex + 1)];
    this.itemListListener(this.itemsArrStore);
  }

}
export const logicProcessor = new LogicProcessor();

