import { createContext, useEffect, useState } from "react";

export const ApplicationContext = createContext(null);

export const ApplicationContextProvider = (props) => {
  // Load state from local storage
  const loadStateFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem("myAppState");
      if (serializedState === null) {
        return {
          loggedInClient: {},
          basketItems: [],
          token: null,
          authenticated: false,
        };
      }
      return JSON.parse(serializedState);
    } catch (error) {
      console.error("Error loading state from local storage:", error);
      return {
        loggedInClient: {},
        basketItems: [],
        token: null,
        authenticated: false,
      };
    }
  };

  const initialState = loadStateFromLocalStorage();

  const [loggedInClient, setLoggedInClient] = useState(initialState.loggedInClient);
  const [basketItems, setBasketItems] = useState(initialState.basketItems);
  const [token, setToken] = useState(initialState.token);
  const [authenticated, setAuthenticated] = useState(initialState.authenticated);

  // Save state to local storage when state changes
  useEffect(() => {
    const state = {
      loggedInClient,
      basketItems,
      token,
      authenticated,
    };
    saveStateToLocalStorage(state);
  }, [loggedInClient, basketItems, token, authenticated]);

  // Saving state to local storage
  const saveStateToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("myAppState", serializedState);
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  };

  const addOrUpdateBasketItem = (article, quantity) => {
    const existingItem = basketItems.find(
      (item) => item.article.article_id === article.article_id
    );
    if (existingItem) {
      const updatedItems = basketItems.map((item) => {
        if (item.article.article_id === article.article_id) {
          return { ...item, quantity: Number(item.quantity) + Number(quantity) };
        }
        return item;
      });
      setBasketItems(updatedItems);
    } else {
      const newBasketItem = {
        id: article.id,
        article: article,
        quantity: quantity,
      };
      setBasketItems([...basketItems, newBasketItem]);
    }
  };

  const removeBasketItem = (article, quantity) => {
    const updatedItems = basketItems.filter(
      (item) => item.article.article_id !== article.article_id
    );
    setBasketItems(updatedItems);
  };

  const removeAllBasketItems = () => {
    setBasketItems([]);
  };

  const contextValue = {
    addOrUpdateBasketItem,
    removeBasketItem,
    removeAllBasketItems,
    setLoggedInClient,
    loggedInClient,
    basketItems,
    token,
    setToken,
    authenticated,
    setAuthenticated,
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {props.children}
    </ApplicationContext.Provider>
  );
};
