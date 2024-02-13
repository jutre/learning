import './challenge_assets/Challenge.scss';

import React, {useState} from 'react';


/**
 * returns form view or succesfull submit message
 * @returns 
 */
function SubcriptionForm(){

  const [inputs, setInputs] = useState({});
  const [inputError, setInputError] = useState("");
  const [showForm, setShowForm] = useState(true);
  /* signals if form was submitted at least once*/
  const [submitAttemptHappened, setSubmitAttemptHappened] = useState(false);

  const  onInputFieldsChange = (event) => {

    //sets changed input's value in state variable
    let name = event.target.name;
    let value = event.target.value;
    //process value for checkbox other way
    if(event.target.type === "checkbox"){
      value = event.target.checked;
    }
    setInputs(values => ({...values, [name]: value}))


    //if form was once submitted than do validation immediately on input change
    if(submitAttemptHappened){
      /*due to timings React updates state we need to construct object that has new value
        of field that has just changed as preceeding setInputs() call does not update "inputs"
        state variable immidiatelly*/
      const currentInputFieldsValues = {...inputs, [name]: value};
      validateInput(currentInputFieldsValues);
    }

  }

  /**
   * sets state variable whether to show form or not depending on validation result
   * 
   * @param  event 
   */

  const handleSubmit = (event) => {
    event.preventDefault();

    //after first submit input will be validated while changing fields
    setSubmitAttemptHappened(true);

    let validationResult = validateInput(inputs);
    if(!validationResult){
      setShowForm(true)
    }else{
      setShowForm(false) 
    }
  }



  //if incorrect input, add error class
  let emailInputFieldClsName = "email-input";
  if(inputError){
    emailInputFieldClsName += " error";
  }

  if(showForm){
    return (
      <div className="newsletter-subscr-form">
        <h1>Subscribe to newsletter</h1>
        <h2>Subscribe to our newsletter and get 10% discount on pineapple glasses.</h2>
  
        <form onSubmit={handleSubmit}>
          <div className={emailInputFieldClsName}>
            <input  type="text"
                    name="email" 
                    value={inputs.email || ""}
                    onChange={onInputFieldsChange}
                    placeholder="Type your email address here…" />
  
            <label className="submit-button">
              <input type="submit" />
              {/*need svg tag here, not img with link to svg file because we need color change on hover*/}
              <svg width="24" height="14" viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.7071 0.2929C17.3166 -0.0976334 16.6834 -0.0976334 16.2929 0.2929C15.9023 0.683403 15.9023 
                1.31658 16.2929 1.70708L20.5858 5.99999H1C0.447693 5.99999 0 6.44772 0 6.99999C0 7.55227 0.447693 7.99999 
                1 7.99999H20.5858L16.2929 12.2929C15.9023 12.6834 15.9023 13.3166 16.2929 13.7071C16.6834 14.0976 17.3166 
                14.0976 17.7071 13.7071L23.7071 7.70708C24.0977 7.31658 24.0977 6.6834 23.7071 6.2929L17.7071 0.2929Z" />
              </svg>
            </label>
          </div>
  
          {inputError && 
            <div className='error-msg'>{inputError}</div>
          }
          
          <div className="agree-toc-input">
            <label>
              <input  type="checkbox"
                      name="agreedToc"
                      checked={inputs.agreedToc || false} onChange={onInputFieldsChange} />
                <span>I agree to <a href="#">terms of service</a></span>
            </label>
          </div>
        </form>
      </div>
    );

  }else{
    return (
      <div className="newsletter-subscr-form">
        <div className="subscription-success-logo" ></div>
        <h1>Thanks for subscribing!</h1>
        <h2>You have successfully subscribed to our email listing. Check your email for the discount code.</h2>
      </div>
    )
  }


  /**
   * Validates input fields. If input is correct, return true, false otherwise. 
   * Sets error message to state variable
   * @param inputs object that represents form input values
   * @returns 
   */
function validateInput(inputs){

  //clear previous error message if any 
  setInputError("")


  if(!inputs.email){
    setInputError("Email address is required")
    return false;

  }else if(!validateEmailFormat(inputs.email)){
    setInputError("Please provide a valid e-mail address")
    return false;
  
  }else if(inputs.email.toLowerCase().endsWith(".co")){
    setInputError("We are not accepting subscriptions from Colombia emails")
    return false;
  
  }else if(!inputs.agreedToc){
    setInputError("You must accept the terms and conditions")
    return false;

  //passed all checks, return true
  }else{
    return true;
  }
}

}

//validates if string conforms to email format
function validateEmailFormat(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};




function App() {

  return (
    <div className="cols-container">
        <div className="left-col"> 
            <div className="top-bar">
                <div className="logo-pineaple">
                </div>
                <div className="links">
                    <ul>
                        <li><a href="#">About</a></li>
                        <li><a href="#">How it works</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
            </div>

            <div className="content-wrapper"> {/* this extra wrapper div is needed in mobile version 
                                              for placing background img behind items below navbar  */}
                <div className="content">

                    <SubcriptionForm/>
                    
                    <div className="social-netw-links">
                        <div className="facebook"><a href="#"><i className="fa fa-facebook"></i></a></div>
                        <div className="instagram"><a href="#"><i className="fa fa-instagram"></i></a></div>
                        <div className="twitter"><a href="#"><i className="fa fa-twitter"></i></a></div>
                        <div className="youtube"><a href="#"><i className="fa fa-youtube-play"></i></a></div>
                    </div>
                </div>
            </div>

        </div>

        
        <div className="right-col">

        </div>
    </div>
  );
}

export default App;

