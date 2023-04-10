import { createContext, useEffect, useState } from "react";

export const ApplicationContext = createContext(null);

export const ApplicationContextProvider = (props) => {
  const [loggedInClient, setLoggedInClient] = useState({});
  const [basketItems, setBasketItems] = useState([]);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

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
