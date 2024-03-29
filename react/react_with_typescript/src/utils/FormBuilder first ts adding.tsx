import { useState } from 'react';


type FormFieldDefinition = { label: string,
  name: string,
  type: string,
  rule?: string,
}

type FormBuilderProps = {
  formFieldsDefinition: FormFieldDefinition[],
  submitButtonText: string,
  initialData: {[index: string]: number | string | boolean},
  successfulSubmitCallback: ({}) => void
}



/**
 * 
 * @param {array} formFieldsDefinition - array of objects. Each object in array represents form field's
 * definition, object properties are dedicated for following purpose
 * "label" - label text for input field, 
 * "name" - input element's "name" attribute value,  
 * "type" - input element's "type" attribute value
 * "rule" - validation rule for fields value,
 * for example, three fields are defined as follows - 
 * 
 * [{label: "id", name:"id", type:"hidden"},
 *  {label: "Title", name:"title", type:"text", rule:"required"}, 
 *  {label: "Description", name:"description", type:"textarea", rule:"required"}]
 *
 * @param {string} submitButtonText - text for submit button, can be empty, default value "Submit"
 * @param {object} initialData - object with data that will be filled in form input fields on initial display.
 * Each object propertie's value will be displayed in input field with name same as propertie's name
 * @param {function(submittedData)} successfulSubmitCallback -function what will be invoked after form submit
 * if all fields pass validation
 * @returns 
 */
export function FormBuilder({ formFieldsDefinition, submitButtonText = "Submit", initialData = {}, successfulSubmitCallback }:
                FormBuilderProps) {
  /*TODO. Currently for the checkbox type input fields initial state object's values are interpreted as Truthy or Falsy
  and stanslated to checked/unchecked state, loosing initial input field value, also after submitting the value for
  those fields are returned as true/false. But there is little inconsistency - if form is submitted
  imidiatelly without mofication of any input field, value attacked to checkbox will be returned to successfulSubmitCallback 
  as they were passed in initial data.  TODO possibly do one of this: 1) convert initial value to Boolean before setting
  into initial state (by using useRef() of useEffect which will run once); 2) Or maybe create behaviour like in case with
  submitting forms with checkbox to server side if uncheckbed, no value sent to server for this fields (at least with PHP
  it works such way) -  it depends on what we need, but usually checked/unchecked means true or false, best values for those
  fiels would be true/false
  TODO finish code for creating radio buttons*/

  //will track all input fields values, initially set to component property value
  const [inputFieldValues, setInputFieldValues] = useState(initialData);
  const [inputErrors, setInputErrors] = useState({});

  const onInputFieldsChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
    //sets changed input's value in state variable
    let name = event.target.name;
    let value = event.target.value;

    //process value for checkbox by examining checked state of checkbox
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    }
    setInputFieldValues(values => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let errors = {}; //actually clear previous errors, as this will be filled with errors from current validation

    for (const formElementDef of formFieldsDefinition) {
      if (formElementDef.rule === "required" && !inputFieldValues[formElementDef.name]) {
        errors = { ...errors, [formElementDef.name]: "this field must not be empty" };
      }
    }
  

    //if there are no input errors, call sucessfull submit callback
    if (Object.keys(errors).length === 0) {
      successfulSubmitCallback(inputFieldValues);
    }

    //set actual errors to state for displaying
    setInputErrors(errors);
  };

 

  return (
    <form onSubmit={handleSubmit}>
      {(formFieldsDefinition).map((formElementDef, index) => {

        //Input elements of different types have different attritutes, use object to add needed attributes conditionally.
        //All input elements have name attribute, are controlled input fields having change handler and current value 
        let fieldValue = inputFieldValues[formElementDef.name] || "";
        let inputElemAttributes = {
          name: formElementDef.name,
          id: formElementDef.name,
          onChange: onInputFieldsChange,
          value: fieldValue
        };

        //create "checked" attrute value (true or false) from field value
        if (formElementDef.type === "checkbox") {
          inputElemAttributes.checked = inputFieldValues[formElementDef.name];
          /*in javascript strings like "false", "0" are interpereted as Truthy values, convert those to Falsey
          in case input object's value tests as Truthy*/
          if (inputElemAttributes.checked) {
            if ((/false/i).test( (inputFieldValues[formElementDef.name] + "")) || inputFieldValues[formElementDef.name] === "0") {
              inputElemAttributes.checked = false;
            }
          }
        }

        //create "input", "textarea", etc. html tag corresponding to type of input in form definition object
        //TODO - add code for "select" tag creation, "<input type='radio' />
        let inputTag;
        if (formElementDef.type === "text" || formElementDef.type === "checkbox" || formElementDef.type === "hidden") {
          inputElemAttributes.type = formElementDef.type;
          inputTag = <input {...inputElemAttributes} />;

        } else if (formElementDef.type === "textarea") {
          inputTag = <textarea {...inputElemAttributes} />;
        }

        /**
         * input tag is created, we must wrap it in div and place label as needed according 
         * to type of input element
         */

        //for "hidden" type input return just <input> tag here, no additional wrapping or label
        if(formElementDef.type === "hidden"){
          //recteate tag by adding "key" attribute which is needed for React in list rendering
          return <input {...inputElemAttributes}  key={formElementDef.name}/>;
        }

        /*for all input tags except checkbox, label comes before input field, checkbox also have
        additional markup to have ability to style it as needed*/
        let inputTagWithLabel;
        let fieldWrapperCssClass = "field " + formElementDef.type;
        if(formElementDef.type === "checkbox"){
          inputTagWithLabel = (
            <>
              <div>{inputTag}</div> 
              <label htmlFor={formElementDef.name}>{formElementDef.label}</label>
            </>) ;
        }else{
          inputTagWithLabel = <> <label htmlFor={formElementDef.name}>{formElementDef.label}</label> {inputTag} </>;
        }
        return (
          <div className={fieldWrapperCssClass} key={formElementDef.name}>
            {inputTagWithLabel}

            {inputErrors[formElementDef.name] &&
              <div className='input_error'>{inputErrors[formElementDef.name]}</div>}
          </div>);
      }
      )}

      <input type="submit" value={submitButtonText}/>

    </form>
  );
}
