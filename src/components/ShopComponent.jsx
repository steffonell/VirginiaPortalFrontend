import React, { useState, useEffect, useContext } from "react";
import ArticleDataService from "../services/ArticleService";
import logo from "./../images/logo.jpg";
import { ApplicationContext } from "./ApplicationContext";
import './ShopComponent.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const images = require.context("./../images/", true);

const ShopComponent = (props) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const { loggedInClient, setLoggedInClient, addOrUpdateBasketItem } = useContext(ApplicationContext);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (id, value) => {
    const newValue = Math.max(value, 0);

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newValue,
    }));
  };

  useEffect(() => {
    retrieveArticles();
  }, []);

  const retrieveArticles = () => {
    ArticleDataService.getAllActiveArticles()
      .then((response) => {
        const articles = response.data;

        // First, sort articles by ID treating ID as a number
        articles.sort((a, b) => Number(a.id) - Number(b.id));

        // Next, group sorted articles by brandName
        let groups = articles.reduce((acc, article) => {
          const brandName = article.brand.brandName;
          if (!acc[brandName]) {
            acc[brandName] = [];
          }
          acc[brandName].push(article);
          return acc;
        }, {});

        // Flatten the grouped articles to get the final sorted list
        const sortedArticles = Object.keys(groups)
          .sort()
          .flatMap(brandName => groups[brandName]);

        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
        setBrands(Object.keys(groups).sort());
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
      if (brandName === "ACTIVE PHARMA") {
        setFilteredArticles(articles.filter(article => article.brand.brandName.startsWith(brandName)));
      } else {
        setFilteredArticles(articles.filter(article => article.brand.brandName === brandName));
      }
    } else {
      setFilteredArticles(articles);
    }
  };

  const numberFormatter = new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency: "RSD",
  });

  const discountedPrice = (price, discount) => {
    return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
  }

  const updatedArticles = filteredArticles.map((article) => {
    const newWholesalePrice = (Number(article.retailPrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
    return { ...article, wholesalePrice: newWholesalePrice };
  });

  const handleValueValidation = (id, value, minQuantityDemand) => {
    const parsedValue = parseInt(value) || 0;
    const newValue = Math.max(Math.round(parsedValue / minQuantityDemand) * minQuantityDemand, 0);

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: newValue,
    }));
  };

  const findArticleImage = (code) => {
    const checkFileExists = (path) => {
      try {
        images(path);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (checkFileExists(`./${code}.jpg`)) {
      return images(`./${code}.jpg`);
    } else if (checkFileExists(`./${code}.png`)) {
      return images(`./${code}.png`);
    } else {
      return logo;
    }
  };

  const addedBrands = new Set();

  return (
    <div className="d-flex shop-main-container">
      <div className="filter-container">
        <div className="brand-filter">
          <h5>Filtriranje po brendu</h5>
          <select
            className="form-select my-1"
            value={selectedBrand}
            onChange={(e) => handleBrandFilterChange(e.target.value)}
          >
            <option value="">Svi brendovi</option>
            {brands.map((brandName, index) => {
              if (brandName.toLowerCase().includes("active pharma")) {
                if (addedBrands.has("ACTIVE PHARMA")) {
                  // Skip adding the option if Active Pharma is already added
                  return null;
                } else {
                  // Add Active Pharma to the set and return the option
                  addedBrands.add("ACTIVE PHARMA");
                  return (
                    <option key={index} value="ACTIVE PHARMA">
                      ACTIVE PHARMA
                    </option>
                  );
                }
              } else {
                // For non-Active Pharma brands, add them normally
                return (
                  <option key={index} value={brandName}>
                    {brandName}
                  </option>
                );
              }
            })}
          </select>
        </div>
      </div>
      <div className="shop-container mt-5">
        {filteredArticles.map((article) => {
          const currentQuantity = quantities[article.article_id] || "";
          const finalPriceWithDiscountForCustomer = discountedPrice(article.wholesalePrice, brandDiscount(article.brand)).toFixed(2);
          return (
            <div
              key={article.article_id}
              className="shop-card"
              style={{ maxWidth: "250px" }}
            >
              <LazyLoadImage
                src={findArticleImage(article.code)}
                alt={article.name}
                className="img-fluid styleShopImage"
              />
              <div>
                <div className="hide-on-mobile">
                  <div className="mb-2">
                    <label className="block mb-1">ID</label>
                    <h6>{article.code}</h6>
                  </div>
                  </div>
                  <div className="h-20 flex flex-col mb-1">
                    <label className="block mb-1">Artikal</label>
                    <h6 className="h-12 truncate-2-lines">{article.name}</h6>
                  </div>
                  <div className="hide-on-mobile">
                  <div className="mb-2">
                    <label className="block mb-1">Transportno Pakovanje</label>
                    <h6> {article.quantityPerTransportPackage} KOM</h6>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Minimalna Količina</label>
                    <h6> {article.minimumQuantityDemand} KOM</h6>
                  </div>
                  <div>
                    <label className="block mb-1">Fakturna Cena</label>
                    <h6 className="block mb-2">{article.wholesalePrice.toFixed(2)} RSD</h6>
                  </div>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Cena sa rabatom [{brandDiscount(article.brand)}%]</label>
                    <h6>{finalPriceWithDiscountForCustomer} RSD</h6>
                  </div>
                <div className="input-group input-group-custom">
                  <div className="input-group-prepend">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => currentQuantity > 0 && handleQuantityChange(article.article_id, currentQuantity - article.minimumQuantityDemand)}
                    >
                      -
                    </button>
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    id={`quantity_${article.article_id}`}
                    required
                    name={`quantity_${article.article_id}`}
                    min={article.minimumQuantityDemand}
                    value={currentQuantity}
                    onChange={(e) => handleQuantityChange(article.article_id, e.target.value)}
                    onBlur={(e) => handleValueValidation(article.article_id, e.target.value, article.minimumQuantityDemand)}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleQuantityChange(article.article_id, currentQuantity + article.minimumQuantityDemand)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    addToBasket(article, currentQuantity);
                  }}
                  className="btn btn-success"
                  disabled={!currentQuantity || currentQuantity % article.minimumQuantityDemand !== 0}
                >
                  Dodaj
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
