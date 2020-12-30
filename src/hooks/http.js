import { useReducer, useCallback } from "react";


const initialState = {
    loading: false,
    error: false,
    data: null,
    extra: null,
    identifier: null,
  };

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null, data: null, extra: null, identifier: action.payload };
    case "RESPONSE":
      return { ...httpState, loading: false, data: action.payload.responseData, extra: action.payload.extra };
    case "ERROR":
      return { loading: false, error: action.payload };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not reach this point");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer,initialState);

  const sendRequest = useCallback((url, method, body, extra, identifier) => {
    dispatchHttp({ type: "SEND", payload: identifier});
    fetch(url, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
        return response.json();
    })
    .then( responseData => {
        dispatchHttp({type: 'RESPONSE', payload: {responseData: responseData, extra: extra} })
    })
    .catch( error => {
        dispatchHttp({ type: 'ERROR', payload: 'Something went wrong'})
    });
  }, []);

  const clear = useCallback( ()=>{
    dispatchHttp({type:'CLEAR'});
  },[]);

  return {
      isLoading: httpState.loading,
      data: httpState.data,
      error: httpState.error,
      sendRequest: sendRequest,
      extra: httpState.extra,
      identifier: httpState.identifier,
      clear: clear,
  };
};

export default useHttp;
