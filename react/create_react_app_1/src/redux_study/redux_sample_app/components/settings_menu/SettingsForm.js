/**
 * displays or hides settings menu. Menu can be closed by click on same element that opened the menu or on any 
 * element in page except menu itself
 * returns books information list. Inteded to use for initial data loading to prefill application with books data or when user
 * changes data source in data source menu.
 * Returns either books list hard coded in this function or fetched from api available at openlibrary.org. 
 */
import { useState } from 'react';
import store from '../../store/store';
import { fetchBooks } from "../../features/booksSlice";

function SettingsForm(){
  const [selectedRadioButtonValue, setSelectedRadioButtonValue] = useState("local");

  let dataSourceOptions = [
    {value: "local", label: "Local sample data"},
    {value: "remote", label: "Data from openlibrary.org"}
  ];

  function handleChange(e){
    let selectedValue = e.target.value;
    setSelectedRadioButtonValue(selectedValue);
    store.dispatch(fetchBooks(selectedValue));
  }

  return (
    <div className="settings_form">
      <div className="form_header">
        Choose source for initial app data:
      </div>
      <div className="options_wrapper">
        {(dataSourceOptions).map((entry, index) =>
          <div  key={index}
                className={"option" + (selectedRadioButtonValue === entry.value ? " active" : "")}>
          <label>
            <input type="radio" 
                  name="data_source_options" 
                  value={entry.value} 
                  checked={selectedRadioButtonValue === entry.value}
                  onChange={handleChange} />
            {entry.label}
          </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsForm;