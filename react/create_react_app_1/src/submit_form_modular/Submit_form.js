import React, { useState, useEffect } from 'react';

import Form from "./Form";
import { external as extClass } from "./External";
 

const App = () => {
  const [showForm, setShowForm] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    extClass.setShowFormFunc=setShowForm
    extClass.setNameFunc=setName
  }, []);

  if(showForm){
    return <div><Form/></div>
  }else{
    return <div>Thank you <strong>{name}</strong>, data is submitted!</div>
  }
}


export default App;