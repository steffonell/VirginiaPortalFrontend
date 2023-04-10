import React, { useEffect, useState } from "react";
import DeliveryAddressDataService from "../services/DeliveryAddressService";
import ClientService from "../services/CustomerService";

const AddDeliveryAddress = () => {
    const initialDeliveryAddressState = {
        delivery_address_id: null,
        city: "",
        address: "",
        customer: null
    };
    const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddressState);
    const [submitted, setSubmitted] = useState(false);
    const [customer, setCustomer] = useState("");
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        retrieveCustomers();
    }, []);

    const retrieveCustomers = () => {
        ClientService.getAll()
            .then(response => {
                setCustomers(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setDeliveryAddress({ ...deliveryAddress, [name]: value });
    };

    const saveDeliveryAddress = () => {
        var data = [{
            city: deliveryAddress.city,
            address: deliveryAddress.address,
        }];

        console.log(data);

        DeliveryAddressDataService.create(data, customer)
            .then(response => {
                setDeliveryAddress({
                    delivery_address_id: response.data.delivery_address_id,
                    city: response.data.city,
                    address: response.data.address,
                    customer: response.data.customer
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };


    const newDeliveryAddress = () => {
        setDeliveryAddress(initialDeliveryAddressState);
        setSubmitted(false);
    };

    const handleCustomerChange = event => {
        console.log(event.target.value);
        setCustomer(event.target.value);
        console.log(customer);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newDeliveryAddress}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="city">Grad</label>
                        <input
                            type="text"
                            className="form-control"
                            delivery_address_id="city"
                            required
                            value={deliveryAddress.city}
                            onChange={handleInputChange}
                            name="city"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Adresa</label>
                        <input
                            type="text"
                            className="form-control"
                            delivery_address_id="address"
                            required
                            value={deliveryAddress.address}
                            onChange={handleInputChange}
                            name="address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="customer">Klijent</label>
                        <select className="form-control" onChange={handleCustomerChange}>
                            <option key="0" value="">Izaberite Klijenta</option>
                            {customers.map((customer, index) => {
                                return (
                                    <option key={index + 1} value={customer.nameOfTheLegalEntity}>
                                        {customer.nameOfTheLegalEntity}
                                    </option>
                                );
                            })}
                        </select>
                    </div>


                    <button onClick={saveDeliveryAddress} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddDeliveryAddress;