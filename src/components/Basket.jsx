import React, { useContext, useState } from "react";
import "./Basket.css";
import { ApplicationContext } from "./ApplicationContext";
import IndentEntryService from "../services/IndentEntryService";

const Basket = () => {
    const { basketItems, removeAllBasketItems, loggedInClient, removeBasketItem } = useContext(ApplicationContext);
    const [entries, setEntries] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState("");

    /*     const confirmOrder = () => {
            if (basketItems && basketItems.length > 0) {
                basketItems.forEach(async (item) => {
                    try {
                        const response = await IndentEntryService.createIndentEntry(loggedInClient.customer_id, item.article.name, item.quantity, deliveryAddress);
                        console.log(response);
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
        }; */

    const confirmOrder = async () => {
        if (basketItems && basketItems.length > 0) {
            const itemsToCreate = basketItems.map((item) => ({
                customerId: loggedInClient.customer_id,
                articleName: item.article.name,
                requestedQuantity: item.quantity,
                deliveryAddress,
            }));

            try {
                const response = await IndentEntryService.createIndentEntries(itemsToCreate);
                console.log(response);
                removeAllBasketItems();
            } catch (error) {
                console.log(error);
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
        return (Number(article.wholesalePrice) * (1 - Number(brandDiscount(article.brand)) / 100)).toFixed(2);
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

    return (
        <div className="basket-container clearfix">
            <h3>Korpa</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Naziv Artikla</th>
                        <th>Količina</th>
                        <th>Cena</th>
                        <th>Ukupno</th>
                        <th>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {basketItems ? (
                        basketItems.map((item) => (
                            <tr key={item.article.id}>
                                <td>{item.article.name}</td>
                                <td>{item.quantity}</td>
                                <td>{formatNumber(articlePriceWithDiscount(item.article))}</td>
                                <td>{formatNumber(articlePriceWithDiscount(item.article) * item.quantity)}</td>
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
            <button className="btn btn-success" onClick={confirmOrder} disabled={!deliveryAddress || basketItems.length === 0}>
                Potvrdi porudžbinu
            </button>
        </div>
    );
};

export default Basket;
