import React, {useState} from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [inputState, setInputState] = useState({title: '', amount: ''});

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title" 
              value = {inputState.title} 
              onChange={event => {
                // we store the event.target.value before we enter the closure
                // because of the way React events (synthetic event re pulling) works
                const titleValue = event.target.value;
                ///////////////////////////////////////////////
                setInputState( prevInputState =>({
                  title: titleValue, 
                  amount: prevInputState.amount
                }))}}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount" 
              value = {inputState.amount} 
              onChange={event => {
                const amountValue = event.target.value;
                setInputState( prevInputState=>({
                  amount: amountValue,
                  title:prevInputState.title
                }))}}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
