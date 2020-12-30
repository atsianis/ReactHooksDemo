import React, { useState, useEffect, useCallback, useReducer } from "react";
import useHttp from '../../hooks/http';

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = ( currentIngredients, action ) => {
  switch (action.type){
    case 'SET':
      return action.payload
    case 'ADD':
      return [...currentIngredients, action.payload]
    case 'DELETE':
      return currentIngredients.filter( ing=> ing.id !== action.payload)
    default:
      throw new Error('Should not get here');
  }
};



function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [ingredients, setIngredients] = useState([]);

  const {isLoading, error, data, sendRequest, extra, identifier, clear} = useHttp();

  
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect( ()=> {
    if( !isLoading && !error && identifier === 'REMOVE' ){
      dispatch({type: 'DELETE', payload: extra});
    }else if ( !isLoading && !error && identifier === 'ADD') {
      dispatch({type: 'ADD', payload:{id: data.name, ...extra}});
    }
    
  }, [data, extra, identifier, isLoading, error])

  const filteredIngredientsHandler = useCallback( filteredIngredients => 
    //setIngredients(filteredIngredients)
    dispatch({
      type: 'SET',
      payload: filteredIngredients
    })
  , []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      "https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json",
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD'
    );
  }, [sendRequest]);

  const removeIngredientHandler = useCallback((id) => {
    sendRequest(
      `https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients/${id}.json`, 
      'DELETE',
      null,
      id,
      'REMOVE',
    );
  }, [sendRequest]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading}/>
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={(id) => {
            removeIngredientHandler(id);
          }}
        />
      </section>
    </div>
  );
}

export default Ingredients;
