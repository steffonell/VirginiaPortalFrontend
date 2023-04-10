import React, { useState, useEffect } from "react";
import DiscountDataService from "../services/DiscountService";
import BrandService from "../services/BrandService";
import CustomerService from "../services/CustomerService";

const AddCustomerDiscount = () => {
    const initialCustomerDiscountState = {
        customer_discount_id: null,
        customer: "",
        brand: "",
        discount: ""
    };
    const [customerDiscount, setCustomerDiscount] = useState(initialCustomerDiscountState);
    const [submitted, setSubmitted] = useState(false);
    const [brands, setBrands] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState({});
    const [selectedCustomer, setSelectedCustomer] = useState({});

    useEffect(() => {
        retrieveBrands();
        retrieveCustomers();
    }, []);


    const retrieveCustomers = () => {
        CustomerService.getAll()
            .then(response => {
                setCustomers(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const retrieveBrands = () => {
        BrandService.getAll()
            .then(response => {
                setBrands(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCustomerDiscount({ ...customerDiscount, [name]: value });
    };

    const saveDiscount = () => {
        var customerId = selectedCustomer.customer_id;
        var brandName = selectedBrand.brandName;
        var discount = customerDiscount.discount;
        console.log(customerId);
        console.log(brandName);
        console.log(discount);
        var data = {
 /*            customer: selectedCustomer,
            brand: selectedBrand,
            discount: customerDiscount.discount */
            customerId: selectedCustomer.customer_id,
            brandName: selectedBrand.brandName,
            discount: customerDiscount.discount
        };

        DiscountDataService.createCustomerDiscount(customerId, brandName, discount)
            .then(response => {
                setCustomerDiscount({
                    customer_discount_id: response.data.customer_discount_id,
                    customer: response.data.customer,
                    brand: response.data.brand,
                    discount: response.data.discount
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newDiscount = () => {
        setCustomerDiscount(initialCustomerDiscountState);
        setSubmitted(false);
    };
    const handleBrandChange = event => {
        const brand = JSON.parse(event.target.value);
        setSelectedBrand(prevBrand => {
            console.log(prevBrand); // log the previous value
            return brand; // return the new value
        });
    };

    const handleCustomerChange = event => {
        const customer = JSON.parse(event.target.value);
        setSelectedCustomer(prevCustomer => {
            console.log(prevCustomer); // log the previous value
            return customer; // return the new value
        });
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newDiscount}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="customer">Klijent</label>
                        <select className="form-control" onChange={handleCustomerChange}>
                            <option key="0" value="">Izaberite Klijenta</option>
                            {customers.map((customer, index) => {
                                return (
                                    <option key={index + 1} value={JSON.stringify(customer)}>
                                        {customer.nameOfTheLegalEntity}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="brand">Brend</label>
                        <select className="form-control" onChange={handleBrandChange}>
                            <option key="0" value="">Izaberite Brend</option>
                            {brands.map((brand, index) => {
                                return (
                                    <option key={index + 1} value={JSON.stringify(brand)}>
                                        {brand.brandName}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Rabat</label>
                        <input
                            type="text"
                            className="form-control"
                            customer_discount_id="discount"
                            required
                            value={customerDiscount.discount}
                            onChange={handleInputChange}
                            name="discount"
                        />
                    </div>

                    <button onClick={saveDiscount} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddCustomerDiscount;