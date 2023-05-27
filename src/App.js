import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ShopComponent from "./components/ShopComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";
import BrandsList from "./components/BrandsList";
import AddBrand from "./components/AddBrand";
import Brand from "./components/Brand";
import ArticlesList from "./components/ArticlesList";
import AddArticle from "./components/AddArticle";
import Article from "./components/Article";
import ClientsList from "./components/ClientsList";
import AddClient from "./components/AddClient";
import Client from "./components/Client";
import IndentsList from "./components/IndentsList";
import AddIndent from "./components/AddIndent";
import Indent from "./components/Indent";
import AddIndentEntry from "./components/AddIndentEntry";
import IndentEntries from "./components/IndentEntries";
import DiscountList from "./components/DiscountList";
import AddCustomerDiscount from "./components/AddCustomerDiscount";
import Basket from "./components/Basket";
import { ApplicationContext } from "./components/ApplicationContext";
import Login from "./components/Login";
import AddDeliveryAddress from "./components/AddDeliveryAddress";
import Forbidden from './components/Forbidden';
import NavbarComponent from "./components/NavbarComponent";
import { eventEmitter } from '../src/components/apiService';

const App = () => {

  const { authenticated, userRole, logout  } = useContext(ApplicationContext);

  useEffect(() => {
    const unauthorizedHandler = () => {
      logout();
    };
    
    eventEmitter.on('unauthorized', unauthorizedHandler);
  
    // cleanup
    return () => {
      eventEmitter.off('unauthorized', unauthorizedHandler);
    };
  }, []);

  function ProtectedComponent(Component, userRole, allowedRoles, props) {
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = user ? user.accessToken : null;
  
    if (!authenticated) {
      return <Navigate to="/" replace />;
    } else if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/forbidden" replace />;
    } else {
      return <Component {...props} />;
    }
  }  

  return (
    <BrowserRouter>
      <NavbarComponent />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/shop" element={ProtectedComponent(ShopComponent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/articles" element={ProtectedComponent(ArticlesList, userRole, ['ROLE_ADMIN'])} />
          <Route path="/articles/add" element={ProtectedComponent(AddArticle, userRole, ['ROLE_ADMIN'])} />
          <Route path="/articles/:id" element={ProtectedComponent(Article, userRole, ['ROLE_ADMIN'])} />
          <Route path="/brands" element={ProtectedComponent(BrandsList, userRole, ['ROLE_ADMIN'])} />
          <Route path="/brands/add" element={ProtectedComponent(AddBrand, userRole, ['ROLE_ADMIN'])} />
          <Route path="/brands/:id" element={ProtectedComponent(Brand, userRole, ['ROLE_ADMIN'])} />
          <Route path="/clients" element={ProtectedComponent(ClientsList, userRole, ['ROLE_ADMIN'])} />
          <Route path="/address/add" element={ProtectedComponent(AddDeliveryAddress, userRole, ['ROLE_ADMIN'])} />
          <Route path="/clients/add" element={ProtectedComponent(AddClient, userRole, ['ROLE_ADMIN'])} />
          <Route path="/clients/:id" element={ProtectedComponent(Client, userRole, ['ROLE_ADMIN'])} />
          <Route path="/indents" element={ProtectedComponent(IndentsList, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/indents/add" element={ProtectedComponent(AddIndent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/indents/:id" element={ProtectedComponent(Indent, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/indentEntry" element={ProtectedComponent(AddIndentEntry, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/indents/entries/:code" element={ProtectedComponent(IndentEntries, userRole, ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/discount" element={ProtectedComponent(DiscountList, userRole, ['ROLE_ADMIN'])} />
          <Route path="/discount/add" element={ProtectedComponent(AddCustomerDiscount, userRole, ['ROLE_ADMIN'])} />
          <Route path="/basket" element={ProtectedComponent(Basket, userRole,  ['ROLE_USER', 'ROLE_ADMIN'])} />
          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
