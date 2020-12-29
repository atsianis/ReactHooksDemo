import React, {useState} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {

  const [ingredients, setIngredients ] = useState([]);

  const addIngredientHandler = ingredient => {
    setIngredients(previousIngredients => 
      [...previousIngredients, {id: Math.random().toString(), ...ingredient}]
    );
  };

  const removeIngredientHandler = (id) => {
    setIngredients(previousIngredients => 
      previousIngredients.filter( (ingredient,__) => ingredient.id !== id)
    )
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={ingredients} onRemoveItem={ (id)=>{removeIngredientHandler(id)} }/>
      </section>
    </div>
  );
}

export default Ingredients;
