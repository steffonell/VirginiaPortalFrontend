import React, { useState } from "react";
import ClientDataService from "../services/CustomerService";

const AddClient = () => {
    const initialClientState = {
        client_id: null,
        nameOfTheLegalEntity: "",
        address: "",
        pib: "",
        identificationNumber: "",
        contactPerson: "",
        contactNumber: "",
        email: "",
        paymentCurrency: ""
    };
    const [client, setClient] = useState(initialClientState);
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setClient({ ...client, [name]: value });
    };

    const saveClient = () => {
        var data = {
            nameOfTheLegalEntity: client.nameOfTheLegalEntity,
            address: client.address,
            pib: client.pib,
            identificationNumber: client.identificationNumber,
            contactPerson: client.contactPerson,
            contactNumber: client.contactNumber,
            email: client.email,
            paymentCurrency: client.paymentCurrency
        };

        ClientDataService.create(data)
            .then(response => {
                setClient({
                    client_id: client.client_id,
                    nameOfTheLegalEntity: client.nameOfTheLegalEntity,
                    address: client.address,
                    pib: client.pib,
                    identificationNumber: client.identificationNumber,
                    contactPerson: client.contactPerson,
                    contactNumber: client.contactNumber,
                    email: client.email,
                    paymentCurrency: client.paymentCurrency
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newClient = () => {
        setClient(initialClientState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newClient}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="nameOfTheLegalEntity">Ime Legalnog Entiteta</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="nameOfTheLegalEntity"
                            required
                            value={client.nameOfTheLegalEntity}
                            onChange={handleInputChange}
                            name="nameOfTheLegalEntity"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Adresa</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="address"
                            required
                            value={client.address}
                            onChange={handleInputChange}
                            name="address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pib">PIB</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="pib"
                            required
                            value={client.pib}
                            onChange={handleInputChange}
                            name="pib"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="identificationNumber">Identifikacioni Broj</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="identificationNumber"
                            required
                            value={client.identificationNumber}
                            onChange={handleInputChange}
                            name="identificationNumber"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactPerson">Kontakt Osoba</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="contactPerson"
                            required
                            value={client.contactPerson}
                            onChange={handleInputChange}
                            name="contactPerson"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactNumber">Kontakt Broj</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="contactNumber"
                            required
                            value={client.contactNumber}
                            onChange={handleInputChange}
                            name="contactNumber"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="email"
                            required
                            value={client.email}
                            onChange={handleInputChange}
                            name="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="paymentCurrency">Valuta Placanja</label>
                        <input
                            type="text"
                            className="form-control"
                            client_id="paymentCurrency"
                            required
                            value={client.paymentCurrency}
                            onChange={handleInputChange}
                            name="paymentCurrency"
                        />
                    </div>

                    <button onClick={saveClient} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddClient;