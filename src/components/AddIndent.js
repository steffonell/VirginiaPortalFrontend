import React, { useState, useEffect } from "react";
import IndentDataService from "../services/IndentService";
import ClientService from "../services/CustomerService";

const AddIndent = () => {
    const initialIndentState = {
        indent_id: "",
        code: "",
        customerId: "",
        indentStatus: ""
    };
    const [indent, setIndent] = useState(initialIndentState);
    const [submitted, setSubmitted] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientName, setClientName] = useState("");

    useEffect(() => {
        retrieveClients();
    }, []);

    const retrieveClients = () => {
        ClientService.getAll()
            .then(response => {
                setClients(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setIndent({ ...indent, [name]: value });
    };

    const handleClientChange = event => {
        setClientName(event.target.value);
    };

    //useForm hook https://react-hook-form.com/api/useform/
    const saveIndent = () => {
        var data = {
            code: indent.code,
            customerId: indent.customerId,
            indentStatus: indent.indentStatus
        };

        IndentDataService.create(data, clientName)
            .then(response => {
                setIndent({
                    indent_id: response.data.indentId,
                    code: response.data.code,
                    customerId: response.data.customerId,
                    indentStatus: response.data.indentStatus
                });
                setSubmitted(true);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const newIndent = () => {
        setIndent(initialIndentState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newIndent}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="code">ID Porudzbenice</label>
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            required
                            value={indent.code}
                            onChange={handleInputChange}
                            name="code"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="clientName">Client</label>
                        <select className="form-control" onChange={handleClientChange}>
                            <option value="">Izaberite Klijenta</option>
                            {clients.map(client => {
                                return (
                                    <option key={client._id} value={client.nameOfTheLegalEntity}>
                                        {client.nameOfTheLegalEntity}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="indentStatus">Status Porudzbenice</label>
                        <select
                            className="form-control"
                            id="indentStatus"
                            required
                            value={indent.indentStatus}
                            onChange={handleInputChange}
                            name="indentStatus"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="ACTIVATED">ACTIVATED</option>
                            <option value="CANCELED">CANCELED</option>
                            <option value="FINISHED">FINISHED</option>
                        </select>
                    </div>

                    <button onClick={saveIndent} className="btn btn-success">
                        Submit
                    </button>
                </div>
            )}
        </div>);
};

export default AddIndent;