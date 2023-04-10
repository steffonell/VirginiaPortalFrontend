import React, { useState, useEffect, useContext } from "react";
import ArticleDataService from "../services/ArticleService";
import ClientDataService from "../services/CustomerService";
import logo from "./../images/logo.jpg";
import { ApplicationContext } from "./ApplicationContext";
import './ShopComponent.css';
import { setAuthToken } from "../components/apiService";

const ShopComponent = (props) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quantity, setQuantity] = useState("");
  const { basketItems, loggedInClient, setLoggedInClient, addOrUpdateBasketItem } = useContext(ApplicationContext);
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

  const updatedArticles = filteredArticles.map((article) => {
    const newWholesalePrice = (Number(article.wholesalePrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
    return { ...article, wholesalePrice: newWholesalePrice };
  });

  return (
    <div className="d-flex">
      <div className="brand-filter">
        <h5>Filtriranje po brendu</h5>
        <button
          className={`btn btn-${!selectedBrand ? 'primary' : 'secondary'} my-1`}
          onClick={() => handleBrandFilterChange(null)}
        >
          Svi brendovi
        </button>
        {brands.map((brandName, index) => (
          <button
            key={index}
            className={`btn btn-${selectedBrand === brandName ? 'primary' : 'secondary'} my-1`}
            onClick={() => handleBrandFilterChange(brandName)}
          >
            {brandName}
          </button>
        ))}
      </div>
      <div className="d-flex flex-wrap justify-content-center mt-5">
        {updatedArticles.map((article) => {
          const currentQuantity = quantities[article.article_id] || "";
          const formattedWholesalePrice = numberFormatter.format(article.wholesalePrice);
          return (
            <div
              key={article.article_id}
              className="shop-card"
              style={{ maxWidth: "300px" }}
            >
              <img
                src={logo}
                alt="Logo"
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div>
                <label>Artikal</label>
                <h4>{article.name}</h4>
                <label>Brend</label>
                <h5>{article.brand.brandName}</h5>
                <br></br>
                <label>Minimalna količina</label>
                <h5> {article.minimumQuantityDemand} KOM</h5>
                <label>Transportno Pakovanje</label>
                <h5> {article.quantityPerTransportPackage} KOM</h5>
                <label>Cena sa rabatom [{brandDiscount(article.brand)}%]</label>
                <h5>{formattedWholesalePrice}</h5>
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
