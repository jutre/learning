import { createStore } from 'redux';

class External {
  constructor() {

    /*before using store
    this.itemsArr = [];*/
    
    this.setInputErrorFunc = null;

    //new
    this.store = createStore(reducer, []);
  }


  processFormSubmit = (newElem) => {
    //clear old errors
    this.setInputErrorFunc("")
    var errorMessages = this.validate(newElem)

    if (!errorMessages) {
      //new element not empty, add to array, clear name in form
      this.store.dispatch({ type: 'TODO_ADD',  todo: newElem}); 
        console.log(this.store.getState(), " logs");
      this.setItemListFunc(this.store.getState()) 

      /*before using store
      this.itemsArr.push(newElem)
      this.setItemListFunc([...this.itemsArr])
      */

      this.setNameFunc("")

    } else {
      //show error msg if empty
      this.setInputErrorFunc(errorMessages)
    }
  }


  //delete from element from object field and set in in component
  deleteElement(element) {
    this.store.dispatch({ type: 'TODO_DELETE',  todo: element});
    this.setItemListFunc(this.store.getState())

    /*before using store
      this.itemsArr = [...this.itemsArr.slice(0, elementIndex), ...this.itemsArr.slice(elementIndex + 1)]
      this.setItemListFunc(this.itemsArr)
      */
  }


  validate(inputStr) {
    if (!inputStr) {
      return "field can not be empty"
    } else {
      return "";
    }
  }
}


function reducer(state, action) {
  switch(action.type) {
    case 'TODO_ADD' : {
      return applyAddTodo(state, action);
    }
    case 'TODO_DELETE' : {
      return applyDeleteTodo(state, action);
    }
    default : return state;
  }
}

function applyAddTodo(state, action) {
  return state.concat(action.todo);
}

function applyDeleteTodo(state, action) {
  return state.filter(todo =>
    todo !== action.todo
  );
}

export const external = new External();

/*for rexux tutorial


//Stories.js
import { connect } from 'react-redux';
import { doArchiveStory } from '../actions/archive';
import { getReadableStories } from '../selectors/story';

const Stories = ({ stories, onArchive }) =>
  <div className="stories">
    <StoriesHeader columns={COLUMNS} />

    {(stories || []).map(story =>
      <Story
        key={story.objectID}
        story={story}
        columns={COLUMNS}
        onArchive={onArchive}
      />
    )}
  </div>


  const mapStateToProps = state => ({
  stories: getReadableStories(state),
});

const mapDispatchToProps = dispatch => ({
  onArchive: id => dispatch(doArchiveStory(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stories);

//----------------------
//Story.js



const Story = ({ story, columns, onArchive }) => {
  const {
    title,
    url,
    author,
    num_comments,
    points,
    objectID,
  } = story;

  return (
    <div className="story">
      ...
      <span style={{ width: columns.archive.width }}>
        <button 
          onClick={() => onArchive(objectID)} >Archive</button>
      </span>
    </div>
  );
}



*/