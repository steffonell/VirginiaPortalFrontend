import React, { useContext, useState, useEffect } from "react";
import "./Basket.css";
import { ApplicationContext } from "./ApplicationContext";
import IndentEntryService from "../services/IndentEntryService";

const Basket = () => {
    const { setBasketItems, basketItems, removeAllBasketItems, loggedInClient, removeBasketItem } = useContext(ApplicationContext);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [missingItemQuantities, setMissingItemQuantities] = useState({}); // Add this state variable

    useEffect(() => {
        const newMissingItemQuantities = validateItemQuantities(basketItems);
        setMissingItemQuantities(newMissingItemQuantities);
    }, [basketItems]); // Watch for changes in the basketItems array

    const validateItemQuantities = (basketItems) => {
        let missingQuantities = {};
        for (let item of basketItems) {
            const remainder = item.quantity % item.article.quantityPerTransportPackage;
            if (remainder !== 0) {
                missingQuantities[item.article.name] = item.article.quantityPerTransportPackage - remainder;
            }
        }
        return missingQuantities;
    };

    const confirmOrder = async () => {
        if (basketItems && basketItems.length > 0) {
            const itemsToCreate = basketItems
                .filter((item) => item.quantity > 0)
                .map((item) => ({
                    customerId: loggedInClient.customer_id,
                    articleName: item.article.name,
                    requestedQuantity: item.quantity,
                    deliveryAddress,
                }));
            try {
                const response = await IndentEntryService.createIndentEntries(itemsToCreate);
                console.log(response);
                removeAllBasketItems();
                // Show confirmation window upon successful order confirmation
                window.confirm('Uspešno kreirana porudžbina!');
            } catch (error) {
                console.log(error);
                window.error('Došlo je do greške!' + error);
            }
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

    const articlePriceWithDiscount = (article) => {
        return (Number(article.retailPrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
    }


    const discountedPrice = (price, discount) => {
        return (Number(price) * (1 - Number(discount / 100)).toFixed(2));
    }

    const priceWithPDV = (price, discount) => {
        return (Number(price) * (1 + Number(discount / 100)).toFixed(2));
    }

    function handleDeliveryAddressChange(event) {
        const selectedValue = event.target.value;
        if (selectedValue) {
            const parsedDeliveryAddress = JSON.parse(selectedValue);
            console.log(parsedDeliveryAddress);
            setDeliveryAddress(parsedDeliveryAddress);
            console.log(deliveryAddress);
        } else {
            setDeliveryAddress("");
        }
    }

    const formatNumber = (number) => {
        return <span>{Number(number).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} RSD</span>
    }

    const totalCost = basketItems
        ? basketItems.reduce((acc, item) => acc + articlePriceWithDiscount(item.article) * item.quantity, 0)
        : 0;

    const handleQuantityChange = (article, newQuantity) => {
        const quantityPerTransportPackage = article.quantityPerTransportPackage;
        const parsedValue = parseInt(newQuantity) || 0;
        const newValue = Math.max(Math.max(parsedValue / quantityPerTransportPackage) * quantityPerTransportPackage, 0);

        const updatedBasketItems = basketItems.map((item) => {
            if (item.article.code === article.code) {
                return { ...item, quantity: newValue };
            }
            return item;
        });
        setBasketItems(updatedBasketItems);
    };

    const handleValueValidation = (article, value, quantityPerTransportPackage) => {
        const parsedValue = parseInt(value) || 0;
        const newValue = Math.max(Math.floor(parsedValue / quantityPerTransportPackage) * quantityPerTransportPackage, 0);

        handleQuantityChange(article, newValue);
    };


    const getPDV = (basketItems) => {
        if (basketItems && basketItems.length > 0) {
            return basketItems[0].article.pdv;
        }
        return 0;
    };

    const pdv = getPDV(basketItems);

    const allItemsHaveZeroQuantity = basketItems.every((item) => item.quantity === 0);

    return (
        <div className="basket-container">
            <h3>Korpa</h3>
            <table className="table table-responsive table-striped table-bordered table-margin">
                <thead>
                    <tr>
                        <th className="hide-on-mobile">Redni Broj</th>
                        <th>Šifra Artikla</th>
                        <th>Artikal</th>
                        <th>Količina</th>
                        <th className="hide-on-mobile">Fakturna Cena</th>
                        <th className="hide-on-mobile">Rabat</th>
                        <th className="hide-on-mobile">Porez</th>
                        <th className="hide-on-mobile">Cena Sa Porezom</th>
                        <th>Iznos</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {basketItems ? (
                        basketItems.map((item, index) => (
                            <tr key={item.article.id}>
                                <td className="hide-on-mobile">{index + 1}</td>
                                <td>{item.article.code}</td>
                                <td>{item.article.name}</td>
                                <td>
                                    <div className="input-group quantity-buttons">
                                        <div className="input-group-prepend">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => item.quantity > 0 && handleQuantityChange(item.article, item.quantity - item.article.minimumQuantityDemand)}
                                            >
                                                -
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            className="form-control input-width"
                                            id={`quantity_${item.article.id}`}
                                            required
                                            name={`quantity_${item.article.id}`}
                                            min={item.article.quantityPerTransportPackage}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.article, e.target.value)}
                                        />
                                        <div className="input-group-append">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleQuantityChange(item.article, item.quantity + item.article.minimumQuantityDemand)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                </td>
                                <td className="hide-on-mobile">{formatNumber(item.article.wholesalePrice)}</td>
                                <td className="hide-on-mobile">{brandDiscount(item.article.brand)} %</td>
                                <td className="hide-on-mobile">{pdv} %</td>
                                <td className="hide-on-mobile">{formatNumber(priceWithPDV(discountedPrice(item.article.wholesalePrice, brandDiscount(item.article.brand)), pdv))}</td>
                                <td>{formatNumber(priceWithPDV(discountedPrice(item.article.wholesalePrice, brandDiscount(item.article.brand)), pdv) * item.quantity)}</td>
                                <td>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => removeBasketItem(item.article)}
                                    >
                                        Ukloni
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <p>Korpa je prazna.</p>
                    )}
                </tbody>
            </table>
            <div className="total-cost">
                <strong>Ukupna cena :</strong> {formatNumber(totalCost)}
            </div>
            <select className="form-control adresa-slanja" onChange={handleDeliveryAddressChange}>
                <option key="0" value="">Izaberite Adresu Slanja</option>
                {loggedInClient && loggedInClient.deliveryAddressList && loggedInClient.deliveryAddressList.map((deliveryAddress, index) => {
                    return (
                        <option key={index + 1} value={JSON.stringify(deliveryAddress)}>
                            {deliveryAddress.city}, {deliveryAddress.address}
                        </option>
                    );
                })}
            </select>
            {Object.keys(missingItemQuantities).length !== 0 && (
                <div className="alert alert-warning" role="alert">
                    {Object.entries(missingItemQuantities).map(([articleName, missingQuantity]) => (
                        <p key={articleName}>
                            Morate dodati jos <strong>{missingQuantity}</strong> komada artikla <strong>{articleName}</strong> da bi potvrdili porudzbinu.
                        </p>
                    ))}
                </div>
            )}
            <button
                className="btn btn-success"
                onClick={confirmOrder}
                disabled={!deliveryAddress || basketItems.length === 0 || allItemsHaveZeroQuantity || Object.keys(missingItemQuantities).length > 0}
            >
                Potvrdi porudžbinu
            </button>
        </div>
    );
};

export default Basket;
