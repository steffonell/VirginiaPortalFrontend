import React, { useContext, useState, useEffect } from "react";
import "./Basket.css";
import { ApplicationContext } from "./ApplicationContext";
import IndentEntryService from "../services/IndentEntryService";

const Basket = () => {
    const { setBasketItems, basketItems, removeAllBasketItems, loggedInClient, removeBasketItem } = useContext(ApplicationContext);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [missingItems, setMissingItems] = useState(0); // Add this state variable

    useEffect(() => {
        setMissingItems(requiredQuantityToAdd(basketItems));
    }, [basketItems]); // Watch for changes in the basketItems array

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
                window.error('Došlo je do greške!'+error);
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

    const requiredQuantityToAdd = (basketItems) => {
        const totalQuantity = basketItems.reduce((acc, item) => acc + item.quantity, 0);
        const remainder = totalQuantity % 24;
        return remainder === 0 ? 0 : 24 - remainder;
    };

    const pdv = getPDV(basketItems);

    const allItemsHaveZeroQuantity = basketItems.every((item) => item.quantity === 0);

    return (
        <div className="basket-container clearfix">
            <h3>Korpa</h3>
            <table className="table table-striped">
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
                        basketItems.map((item) => (
                            <tr key={item.article.id}>
                                <td className="hide-on-mobile">1</td>
                                <td>{item.article.code}</td>
                                <td>{item.article.name}</td>
                                <td>
                                    <div className="input-group">
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
            <select className="form-control" onChange={handleDeliveryAddressChange} style={{ width: '400px' }}>
                <option key="0" value="">Izaberite Adresu Slanja</option>
                {loggedInClient && loggedInClient.deliveryAddressList && loggedInClient.deliveryAddressList.map((deliveryAddress, index) => {
                    return (
                        <option key={index + 1} value={JSON.stringify(deliveryAddress)}>
                            {deliveryAddress.city}, {deliveryAddress.address}
                        </option>
                    );
                })}
            </select>
            {missingItems !== 0 && (
                <div className="alert alert-warning" role="alert">
                    Morate dodati još {missingItems} proizvoda kako biste mogli da potvrdite porudžbinu.
                </div>
            )}
            <button
                className="btn btn-success"
                onClick={confirmOrder}
                disabled={!deliveryAddress || basketItems.length === 0 || allItemsHaveZeroQuantity || requiredQuantityToAdd(basketItems) !== 0}
            >
                Potvrdi porudžbinu
            </button>
        </div>
    );
};

export default Basket;
