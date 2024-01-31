import React from 'react';
import { useState } from "react";
import { memo } from "react";

const Message = ({fromOuter}) => {
    const [message, setMessage] = useState( '' );
    console.log("inner ", message)
    return (
      <div>
        <input
           type="text"
           value={message}
           placeholder="Enter a message"
           onChange={e => setMessage(e.target.value)}
         />
        <p>inner  -
          <strong>{message}</strong><br/> from outer - {fromOuter}
        </p>
      </div>
    );
  };

  export default memo(Message);