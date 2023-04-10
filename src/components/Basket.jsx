import React, { useContext, useState } from "react";
import "./Basket.css";
import { ApplicationContext } from "./ApplicationContext";
import IndentEntryService from "../services/IndentEntryService";

const Basket = () => {
    const { basketItems, removeAllBasketItems, loggedInClient } = useContext(ApplicationContext);
    const [entries, setEntries] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const totalCost = basketItems
        ? basketItems.reduce((acc, item) => acc + item.article.wholesalePrice * item.quantity, 0)
        : 0;

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

    function handleDeliveryAddressChange(event) {
        const parsedDeliveryAddress = JSON.parse(event.target.value);
        console.log(parsedDeliveryAddress);
        setDeliveryAddress(parsedDeliveryAddress);
        console.log(deliveryAddress);
    }

    return (
        <div className="basket-container">
            <h3>Korpa</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Naziv Artikla</th>
                        <th>Količina</th>
                        <th>Cena</th>
                        <th>Ukupno</th>
                    </tr>
                </thead>
                <tbody>
                    {basketItems ? (
                        basketItems.map((item) => (
                            <tr key={item.article.id}>
                                <td>{item.article.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.article.wholesalePrice}</td>
                                <td>{item.article.wholesalePrice * item.quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <p>Korpa je prazna.</p>
                    )}
                </tbody>
            </table>
            <div className="total-cost">
                <strong>Ukupna cena :</strong> {totalCost}
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
            <button className="btn btn-success" onClick={confirmOrder} disabled={!deliveryAddress}>
                Potvrdi porudžbinu
            </button>
        </div>
    );
};

export default Basket;
