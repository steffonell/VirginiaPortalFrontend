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
          userRole: null,
          userName: null,
          email: null
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
        userRole: null,
        userName: null,
        email: null
      };
    }
  };

  const initialState = loadStateFromLocalStorage();
  const [userName, setUserName] = useState(initialState.userName);
  const [email, setEmail] = useState(initialState.userName); //needed to perserve the email for manual
  const [loggedInClient, setLoggedInClient] = useState(initialState.loggedInClient);
  const [basketItems, setBasketItems] = useState(initialState.basketItems);
  const [token, setToken] = useState(initialState.token);
  const [authenticated, setAuthenticated] = useState(initialState.authenticated);
  const [userRole, setUserRole] = useState(initialState.userRole);

  // Save state to local storage when state changes
  useEffect(() => {
    const state = {
      loggedInClient,
      basketItems,
      token,
      authenticated,
      userRole,
      userName,
      email
    };
    saveStateToLocalStorage(state);
  }, [loggedInClient, basketItems, token, authenticated, userRole, userName, email]);
  
  // Saving state to local storage
  const saveStateToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("myAppState", serializedState);
    } catch (error) {
      console.error("Error saving state to local storage:", error);
    }
  };

  const logout = () => {
    setAuthenticated(false);
    setLoggedInClient({});
    setBasketItems([]);
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setEmail(null);
  }

  // kada nema autentifikacije da se brise kontekst
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

  const removeBasketItem = (article) => {
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
    setBasketItems,
    basketItems,
    token,
    setToken,
    authenticated,
    setAuthenticated,
    userRole,
    setUserRole,
    userName,
    setUserName,
    email,
    setEmail,
    logout
  };

  return (
    <ApplicationContext.Provider value={contextValue}>
      {props.children}
    </ApplicationContext.Provider>
  );
};
