import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);

  useEffect( ()=> {
    fetch('https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json')
      .then( response => response.json())
      .then( responseData => {
        const loadedIngredients = [];
        for ( const key in responseData ){
          loadedIngredients.push({
            id: key,
            title : responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setIngredients(loadedIngredients);
      })
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(
      "https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify({ ...ingredient }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
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

  const removeIngredientHandler = (id) => {
    setIngredients((previousIngredients) =>
      previousIngredients.filter((ingredient, __) => ingredient.id !== id)
    );
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
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
