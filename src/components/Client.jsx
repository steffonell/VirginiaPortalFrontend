import React, { useState, useEffect } from "react";
import ClientDataService from "../services/CustomerService";

const Client = props => {
  const initialClientState = {
    id: null,
    nameOfTheLegalEntity: "",
    address: "",
    pib:"",
    identificationNumber:"",
    contactPerson:"",
    contactNumber:"",
    email:"",
    paymentCurrency:""
  };
  const [currentClient, setCurrentClient] = useState(initialClientState);
  const [message, setMessage] = useState("");

  const getClient = id => {
    ClientDataService.get(id)
      .then(response => {
        setCurrentClient(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getClient(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentClient({ ...currentClient, [name]: value });
  };

  const updatePublished = status => {
    var data = {
      id: currentClient.client_id,
      nameOfTheLegalEntity: currentClient.nameOfTheLegalEntity,
      address: currentClient.address,
      pib: currentClient.pib,
      identificationNumber: currentClient.identificationNumber,
      contactPerson: currentClient.contactPerson,
      contactNumber: currentClient.contactNumber,
      email: currentClient.email,
      paymentCurrency: currentClient.paymentCurrency
    };

    ClientDataService.update(currentClient.id, data)
      .then(response => {
        setCurrentClient({ ...currentClient});
        console.log(response.data);
        setMessage("The status was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const updateClient = () => {
    ClientDataService.update(currentClient.id, currentClient)
      .then(response => {
        console.log(response.data);
        setMessage("The client was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteClient = () => {
    ClientDataService.remove(currentClient.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/clients");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
        <h1>ClientCOMPONENT</h1>
    </div>
   /*  <div>
      {currentClient ? (
        <div className="edit-form">
          <h4>Client</h4>
          <form>
            <div className="form-group">
              <label htmlFor="clientName">Name</label>
              <input
                type="text"
                className="form-control"
                id="clientName"
                name="clientName"
                value={currentClient.clientName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Description</label>
              <input
                type="text"
                className="form-control"
                id="discount"
                name="discount"
                value={currentClient.discount}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteClient}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateClient}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Client...</p>
        </div>
      )}
    </div> */
  );
};

export default Client;