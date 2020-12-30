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
      return [...currentIngredients, action.payload]
    case 'DELETE':
      return currentIngredients.filter( ing=> ing.id !== action.payload)
    default:
      throw new Error('Should not get here');
  }
};

const httpReducer = (httpState, action)=>{
  switch (action.type){
    case 'SEND':
      return {loading: true, error: null}
    case 'RESPONSE':
      return {...httpState, loading: false}
    case 'ERROR':
      return { loading: false, error: action.payload}
    case 'CLEAR':
      return {...httpState, error: null}
    default:
      throw new Error('Should not reach this point');
  }
};

function Ingredients() {

  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [ingredients, setIngredients] = useState([]);

  const [httpState, dispatchHttp] = useReducer(httpReducer,{loading: false, error: false});
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  const filteredIngredientsHandler = useCallback( filteredIngredients => 
    //setIngredients(filteredIngredients)
    dispatch({
      type: 'SET',
      payload: filteredIngredients
    })
  , []);

  const addIngredientHandler = (ingredient) => {
    dispatchHttp({type: 'SEND'});
    // setIsLoading(true);
    fetch(
      "https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify({ ...ingredient }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        dispatchHttp({type: 'RESPONSE'});
        // setIsLoading(false);
        console.log(response);
        // response.json return a Promise that contains the body of the response !!!
        return response.json();
      })
      .then((responseData) => {
        console.log(responseData);
        // Firebase automnatically gives every posted element a key, that is store
        // under the name property !
        // setIngredients((previousIngredients) => [
        //   ...previousIngredients,
        //   { id: responseData.name, ...ingredient },
        // ]);

        dispatch({
          type:'ADD',
          payload:{id: responseData.name, ...ingredient}
        })
      }).catch( error => {
        dispatchHttp({
          type: 'ERROR',
          payload: error.message
        })
      });
  };

  const clearError =()=> {
    dispatchHttp({type: 'CLEAR'})
    //setError(null);
  }

  const removeIngredientHandler = (id) => {
    dispatchHttp({type: 'SEND'});
    // setIsLoading(true);
    fetch(
      `https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    ).then( response => {
      dispatchHttp({type: 'RESPONSE'})
      // setIsLoading(false);
      
      // setIngredients((previousIngredients) =>
      // previousIngredients.filter((ingredient, __) => ingredient.id !== id)
    // )
    dispatch({
      type: 'DELETE',
      payload: id
    })
  }
    ).catch (error => {
      dispatch({type: 'ERROR', payload: error.mesage})
      
      // Check React's State Batching concept
      // setError(error.message);
      // setIsLoading(false);
    })
    
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading}/>

      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

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
