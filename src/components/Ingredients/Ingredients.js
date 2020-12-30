import React, { useState, useEffect, useCallback, useReducer } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = ( currentIngredients, action ) => {
  switch (action.type){
    case 'SET':
      return action.payload
    case 'ADD':
      return [...ingredients, action.payload]
    case 'DELETE':
      return currentIngredients.filter( ing=> ing.id !== action.payload)
    default:
      throw new Error('Should not get here');
  }
}

function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback( filteredIngredients => 
    setIngredients(filteredIngredients)
  , []);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify({ ...ingredient }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        console.log(response);
        // response.json return a Promise that contains the body of the response !!!
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        // Firebase automnatically gives every posted element a key, that is store
        // under the name property !
        setIngredients((previousIngredients) => [
          ...previousIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const clearError =()=> {
    setError(null);
  }

  const removeIngredientHandler = (id) => {
    setIsLoading(true);
    fetch(
      `https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    ).then( response => {
      setIsLoading(false);
      setIngredients((previousIngredients) =>
      previousIngredients.filter((ingredient, __) => ingredient.id !== id)
    )}
    ).catch (error => {
      // Check React's State Batching concept
      setError(error.message);
      setIsLoading(false);
    })
    
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>

      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={(id) => {
            removeIngredientHandler(id);
          }}
        />
      </section>
    </div>
  );
}

export default Ingredients;
