import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ShopComponent from "./components/ShopComponent";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";
import Navbar from "./components/NavBar";
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

const App = () => {

  const { authenticated } = useContext(ApplicationContext);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/shop" element={<ShopComponent />} />
          <Route exact path="/articles" element={<ArticlesList />} />
          <Route exact path="/articles/add" element={<AddArticle />} />
          <Route exact path="/articles/:id" element={<Article />} />
          <Route exact path="/brands" element={<BrandsList />} />
          <Route exact path="/brands/add" element={<AddBrand />} />
          <Route path="/brands/:id" element={<Brand />} />
          <Route exact path="/clients" element={<ClientsList />} />
          <Route exact path="/address/add" element={<AddDeliveryAddress />} />
          <Route exact path="/clients/add" element={<AddClient />} />
          <Route exact path="/clients/:id" element={<Client />} />
          <Route exact path="/indents" element={<IndentsList />} />
          <Route exact path="/indents/add" element={<AddIndent />} />
          <Route exact path="/indents/:id" element={<Indent />} />
          <Route exact path="/indentEntry" element={<AddIndentEntry />} />
          <Route exact path="/indents/entries/:code" element={<IndentEntries />} />
          <Route exact path="/discount" element={<DiscountList />} />
          <Route exact path="/discount/add" element={<AddCustomerDiscount />} />
          <Route exact path="/basket" element={<Basket />} />
          <Route exact path="/forbidden" element={<Forbidden />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;