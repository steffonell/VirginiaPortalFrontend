import React, { useState, useEffect, useContext } from "react";
import ArticleDataService from "../services/ArticleService";
import ClientDataService from "../services/CustomerService";
import logo from "./../images/logo.jpg";
import { ApplicationContext } from "./ApplicationContext";
import './ShopComponent.css';
import { setAuthToken } from "../components/apiService";
const images = require.context("./../images/", true);

const ShopComponent = (props) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const { loggedInClient, setLoggedInClient, addOrUpdateBasketItem } = useContext(ApplicationContext);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: parseInt(value) || "",
    }));
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the user object from local storage
    const token = user ? user.accessToken : null; // Extract the accessToken from the user object
    setAuthToken(token);
    retrieveArticles();
    ClientDataService.getAll()
      .then((response) => {
        console.log(response.data);
        const firstClient = response.data[0];
        console.log(firstClient);
        setLoggedInClient(firstClient);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const retrieveArticles = () => {
    ArticleDataService.getAll()
      .then((response) => {
        setArticles(response.data);
        setFilteredArticles(response.data);
        setBrands([...new Set(response.data.map((article) => article.brand.brandName))]);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const addToBasket = (article, quantity) => {
    if (quantity > 0) {
      addOrUpdateBasketItem(article, quantity);
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [article.article_id]: "",
      }));
    }
  };

  const brandDiscount = (brand) => {
    const brandName = brand.brandName;
    const discountForTheBrand = loggedInClient?.discounts?.find((item) => item.brand.brandName === brandName);
    if (discountForTheBrand) {
      return discountForTheBrand.discount;
    } else {
      return 0;
    }
  };

  const handleBrandFilterChange = (brandName) => {
    setSelectedBrand(brandName);
    if (brandName) {
      setFilteredArticles(articles.filter(article => article.brand.brandName === brandName));
    } else {
      setFilteredArticles(articles);
    }
  };

  const numberFormatter = new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
  });

  const discountedPrice = (price, discount) =>{
    return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
  }

  const updatedArticles = filteredArticles.map((article) => {
    const newWholesalePrice = (Number(article.retailPrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
    return { ...article, wholesalePrice: newWholesalePrice };
  });

  return (
    <div className="d-flex shop-main-container">
       <div className="brand-filter">
        <h5>Filtriranje po brendu</h5>
        <select
          className="form-select my-1"
          value={selectedBrand}
          onChange={(e) => handleBrandFilterChange(e.target.value)}
        >
          <option value="">Svi brendovi</option>
          {brands.map((brandName, index) => (
            <option key={index} value={brandName}>
              {brandName}
            </option>
          ))}
        </select>
      </div>
      <div className="shop-container mt-5">
        {filteredArticles.map((article) => {
          const currentQuantity = quantities[article.article_id] || "";
          const finalPriceWithDiscountForCustomer = discountedPrice(article.retailPrice, brandDiscount(article.brand));
          const priceWithPDV = article.retailPrice.toFixed(2);
          return (
            <div
              key={article.article_id}
              className="shop-card"
              style={{ maxWidth: "300px" }}
            >
<img
  src={article.image_source ? images(`${article.image_source}`) : logo}
  alt={article.name}
  className="img-fluid"
  style={{ height: "200px", objectFit: "cover" }}
/>
              <div>
                <label>Artikal</label>
                <h4>{article.name}</h4>
                <label>Brend</label>
                <h5>{article.brand.brandName}</h5>
                <br></br>
                <label>Transportno Pakovanje</label>
                <h5> {article.quantityPerTransportPackage} KOM</h5>
                <label>Cena sa PDV [{article.pdv}%]</label>
                <h5>{priceWithPDV} RSD</h5>
                <label>Cena sa rabatom [{brandDiscount(article.brand)}%]</label>
                <h5>{finalPriceWithDiscountForCustomer} RSD</h5>
                <br></br>
                <br></br>
                <div className="form-group">
                  <label htmlFor={`quantity_${article.article_id}`}>Količina</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`quantity_${article.article_id}`}
                    required
                    name={`quantity_${article.article_id}`}
                    min={article.minimumQuantityDemand}
                    value={currentQuantity}
                    onChange={(e) => handleQuantityChange(article.article_id, e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    addToBasket(article, currentQuantity);
                  }}
                  className="btn btn-success"
                  disabled={!currentQuantity || currentQuantity % article.quantityPerTransportPackage !== 0}
                >
                  Dodaj u porudžbinu
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopComponent;
