import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  // Object Destructuring
  // We store the function in a variable with the same name so that we can declare it
  // in the dependencies of out useEffect function
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState("");
  // the useRef hook allows us to create references on any element we want
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      // We need to undrstand how CLOSURES work 
      // in order to understand how the following line makes sense
      // 'enteredFilter' here is not going to be updated on every key stroke. 
      // The 'setTimeout' method ENCLOSES in it
      // the value that 'enteredFilter' HAD AT THE EXACT TIME  THAT THE FUNCTION WAS CALLED
      // That's why we need a way to compare this value with the current value

      // So in a nutshell we say: 
      // IF the value of the input when the function started executing 
      // is the same with the value of the input now (500 miliseconds later)
      // (basically if the user has paused typing for 0.5 seconds) THEN send the request !
      // Open the Network tab on the browser while this runs to see that
      // a request is only being sent when a typing pause happens
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`;
        fetch(
          "https://reacthooksdemo-4f235-default-rtdb.firebaseio.com/ingredients.json" +
            query
        )
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            props.onLoadIngredients(loadedIngredients);
          });
      }
      return ()=>{
        clearTimeout(timer);
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
