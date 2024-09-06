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
import { useNavigate } from "react-router-dom";
import { routes } from "../../config";

function SettingsForm({closeMenuHandler}){
  const [selectedRadioButtonValue, setSelectedRadioButtonValue] = useState("local");

  let dataSourceOptions = [
    {value: "local", label: "Local sample data"},
    {value: "remote", label: "Data from openlibrary.org"}
  ];

  const navigate = useNavigate();

  function handleChange(event){
    let selectedValue = event.target.value;
    setSelectedRadioButtonValue(selectedValue);
    store.dispatch(fetchBooks(selectedValue));
    //after loading new initial data, close menu and redirect to all books list as if currently user is 
    //on book edit page then book edit page form would be filled with data just loaded
    closeMenuHandler();
    navigate(routes.bookListPath);
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